import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DBName = "sysscan_invoice_v4.db";
const DB_URL =
  "https://drive.google.com/uc?export=download&id=1zYQaAlY8V8najND0x0ljNpFKp27rK96N";
const RESUME_DATA_KEY = "dbDownloadResumeData";

export async function openDatabase(onProgress?: (progress: number) => void) {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDirectory}/${DBName}`;
  const tempPath = `${dbPath}.tmp`;

  // Ensure directory exists
  if (!(await FileSystem.getInfoAsync(dbDirectory)).exists) {
    await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
  }

  // Check existing DB
  if (await isDatabaseValid(dbPath)) {
    console.log("✅ Database exists and is valid.");
    return SQLite.openDatabaseSync(DBName);
  } else {
    console.warn("⚠ Database missing or invalid. Preparing fresh download...");
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
  }

  // Prepare resumable download
  const savedResumeData = await AsyncStorage.getItem(RESUME_DATA_KEY);
  const downloadResumable = FileSystem.createDownloadResumable(
    DB_URL,
    tempPath,
    {},
    (progressEvent) => {
      const progress =
        progressEvent.totalBytesWritten /
        progressEvent.totalBytesExpectedToWrite;
      onProgress?.(Math.floor(progress * 100));
    },
    savedResumeData || undefined
  );

  let uri: string;
  try {
    const result = savedResumeData
      ? await downloadResumable.resumeAsync()
      : await downloadResumable.downloadAsync();

    uri = result?.uri;
    await AsyncStorage.removeItem(RESUME_DATA_KEY); // Clear saved resume data
  } catch (err: any) {
    // Save resume data if available
    if (err.resumeData) {
      console.log("⏸ Download interrupted. Saving resume data...");
      await AsyncStorage.setItem(RESUME_DATA_KEY, err.resumeData);
    } else {
      console.error("❌ Download failed without resumable data:", err);
    }
    throw err;
  }

  // Size check
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (!fileInfo.exists || fileInfo.size < 100) {
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
    throw new Error("❌ Downloaded DB file is too small or missing.");
  }

  // Move file to final location
  await FileSystem.moveAsync({ from: tempPath, to: dbPath });

  // Final integrity check
  if (!(await isDatabaseValid(dbPath))) {
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    throw new Error("❌ DB failed integrity check after download.");
  }

  console.log("✅ Database ready.");
  return SQLite.openDatabaseSync(DBName);
}

// --- Helper: Check DB validity by size and integrity ---
async function isDatabaseValid(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists || info.size < 100) {
    return false;
  }

  try {
    const dbName = path.split("/").pop()!;
    const db = SQLite.openDatabaseSync(dbName);
    const result = db.getFirstSync<{ integrity_check: string }>(
      "PRAGMA integrity_check;"
    );
    return result?.integrity_check === "ok";
  } catch (err) {
    console.error("❌ DB integrity check failed:", err);
    return false;
  }
}

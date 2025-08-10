import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DBName = "sysscan_invoice_v4.db";
const DB_URL =
  "https://drive.google.com/uc?export=download&id=11SnRf11_8T053xiyvvwgsN_1z6m5f9_T";

export async function openDatabase(onProgress?: (progress: number) => void) {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDirectory}/${DBName}`;
  const tempPath = `${dbPath}.tmp`;

  // Create directory if missing
  if (!(await FileSystem.getInfoAsync(dbDirectory)).exists) {
    await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
  }

  // Validate existing DB
  if (await isDatabaseValid(dbPath)) {
    console.log("Database exists and is valid.");
    return SQLite.openDatabaseSync(DBName);
  } else {
    console.warn("Database missing or invalid. Downloading new copy...");
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    await FileSystem.deleteAsync(tempPath, { idempotent: true });
  }

  // Download new DB to a temp file
  const downloadResumable = FileSystem.createDownloadResumable(
    DB_URL,
    tempPath,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      onProgress?.(Math.floor(progress * 100));
    }
  );

  const { uri } = await downloadResumable.downloadAsync();

  // Size check
  const downloadedInfo = await FileSystem.getInfoAsync(uri);
  if (!downloadedInfo.exists || downloadedInfo.size < 100) {
    throw new Error("Downloaded DB file is invalid or incomplete.");
  }

  // Move temp file to final DB location
  await FileSystem.moveAsync({ from: tempPath, to: dbPath });

  // Final integrity check
  if (!(await isDatabaseValid(dbPath))) {
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
    throw new Error("Database failed integrity check after download.");
  }

  console.log("Database ready.");
  return SQLite.openDatabaseSync(DBName);
}

// --- Helper: Validate DB by size + SQLite integrity check ---
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
    console.error("DB integrity check failed:", err);
    return false;
  }
}

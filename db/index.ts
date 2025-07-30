import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DBName = "sysscan_invoice.db";

export async function openDatabase() {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDirectory}/${DBName}`;

  // Ensure the SQLite directory exists.
  if (!(await FileSystem.getInfoAsync(dbDirectory)).exists) {
    await FileSystem.makeDirectoryAsync(dbDirectory);
  }

  // This check is important. We only copy the DB from assets if it's not already
  // in the writable directory. Deleting it every time is inefficient.
  if (!(await FileSystem.getInfoAsync(dbPath)).exists) {
    console.log("Database file not found. Copying from assets...");
    // The asset path must be correct. Assuming `db` folder is inside `src`,
    // and `assets` is at the root level, `../../assets` is the correct path.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const asset = Asset.fromModule(require(`../assets/${DBName}`));
    await FileSystem.downloadAsync(asset.uri, dbPath);
    console.log("Database copied successfully.");
  } else {
    console.log("Database file already exists. Opening it.");
  }

  return SQLite.openDatabaseSync(DBName);
}

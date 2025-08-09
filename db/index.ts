import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

const DBName = "sysscan_invoice_v2.db";
const DB_URL =
  "https://drive.google.com/file/d/11SnRf11_8T053xiyvvwgsN_1z6m5f9_T/view?usp=sharing";

export async function openDatabase() {
  const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${dbDirectory}/${DBName}`;

  if (!(await FileSystem.getInfoAsync(dbDirectory)).exists) {
    await FileSystem.makeDirectoryAsync(dbDirectory);
  }

  if (!(await FileSystem.getInfoAsync(dbPath)).exists) {
    console.log("Database file not found. Copying from assets...");

    // const asset = Asset.fromModule(require(`../assets/${DBName}`));
    // await FileSystem.downloadAsync(asset.uri, dbPath);
    await FileSystem.downloadAsync(DB_URL, dbPath);
    console.log("Database copied successfully.");
  } else {
    console.log("Database file already exists. Opening it.");
  }

  return SQLite.openDatabaseSync(DBName);
}

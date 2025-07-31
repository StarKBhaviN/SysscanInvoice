import type { SQLiteDatabase } from "expo-sqlite";
import { CompanyController } from "./CompanyController";

export const Controllers = (db: SQLiteDatabase) => ({
  // Home: HomeController(db),
  Company: CompanyController(db),
  // Add more as needed
});

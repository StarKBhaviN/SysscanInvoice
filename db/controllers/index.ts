import type { SQLiteDatabase } from "expo-sqlite";
import { CompanyController } from "./CompanyController";
import { HomeController } from "./HomeController";

export const Controllers = (db: SQLiteDatabase) => ({
  Company: CompanyController(db),
  Home: HomeController(db),
  // Add more as needed
});

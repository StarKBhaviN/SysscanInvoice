import type { SQLiteDatabase } from "expo-sqlite";
import { CompanyController } from "./CompanyController";
import {
  HomeController,
  PayablesController,
  ReceivablesController,
} from "./HomeController";

export const Controllers = (db: SQLiteDatabase) => ({
  Company: CompanyController(db),
  Home: HomeController(db),
  Receivables: ReceivablesController(db),
  Payables: PayablesController(db),
  // Add more as needed
});

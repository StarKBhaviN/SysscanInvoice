import type { SQLiteDatabase } from "expo-sqlite";
import { HomeQueries } from "../sql_queries";

export const CompanyController = (db: SQLiteDatabase) => ({
  async getHome() {
    const result = await db.getAllAsync(HomeQueries.getHome);
    return result;
  },
});

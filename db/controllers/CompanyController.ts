import type { SQLiteDatabase } from "expo-sqlite";
import { getHeaderCompanyDataQuery } from "../sql_queries";

export const CompanyController = (db: SQLiteDatabase) => ({
  async getHeaderCompanyData() {
    const result = await db.getAllAsync(getHeaderCompanyDataQuery);
    return result;
  },
});

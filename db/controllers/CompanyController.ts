import type { SQLiteDatabase } from "expo-sqlite";
import { getHeaderCompanyDataQuery } from "../sql_queries";

export const CompanyController = (db: SQLiteDatabase) => ({
  async getHeaderCompanyData() {
    console.log("Fetching header company data");
    const result = await db.getAllAsync(getHeaderCompanyDataQuery);
    console.log("Header company data fetched: ");
    return result;
  },
});

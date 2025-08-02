import type { SQLiteDatabase } from "expo-sqlite";
import { getSalesQuery, HomeQueries, SalesQueries } from "../sql_queries";

export const CompanyController = (db: SQLiteDatabase) => ({
  async getHome() {
    const result = await db.getAllAsync(HomeQueries.getHome);
    return result;
  },
  async getSales(
    queryName: keyof SalesQueries,
    selectedCompanyCodes: string[]
  ) {
    const queries = getSalesQuery(selectedCompanyCodes);
    if (!queries) {
      return [];
    }

    const query = queries[queryName];
    if (!query) {
      throw new Error(`Query "${queryName}" not found.`);
    }

    const result = await db.getAllAsync(query);
    return result;
  },
});

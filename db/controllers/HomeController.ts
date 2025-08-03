import { HomeQueries } from "@/types/queries.types";
import { SQLiteDatabase } from "expo-sqlite";
import { getHomeQueries } from "../sql_queries";

export const HomeController = (db: SQLiteDatabase) => ({
  async getAllHome(
    queryName: keyof HomeQueries,
    selectedCompanyCodes: string[]
  ) {
    const queries = getHomeQueries(selectedCompanyCodes);
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

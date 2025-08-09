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

  async getSummaryByTyp(selectedCompanyCodes: string[], typ: string) {
    const queries = getHomeQueries(selectedCompanyCodes);
    if (!queries) return [];

    const query = queries.getSummaryByTyp;
    if (!query) return [];

    // Execute the query, passing the 'typ' as a parameter to replace the '?'
    const result = await db.getAllAsync(query, [typ]);
    return result ?? [];
  },

  async getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    typ: string,
    partyName: string
  ) {
    const queries = getHomeQueries(selectedCompanyCodes);
    if (!queries) return [];

    const query = queries.getSummaryDetailsByTyp;
    // Execute the query, passing the 'typ' as a parameter to replace the '?'
    const result = await db.getAllAsync(query, [typ, partyName]);
    return result;
  },
  async getDetailsByTyp(selectedCompanyCodes: string[], typ: string) {
    const queries = getHomeQueries(selectedCompanyCodes);
    if (!queries) return [];

    const query = queries.getDetailsByTyp;
    // Execute the query, passing the 'typ' as a parameter to replace the '?'
    const result = await db.getAllAsync(query, [typ]);
    return result;
  },
});

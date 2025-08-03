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

  // async getSales(
  //   queryName: keyof SalesQueries,
  //   selectedCompanyCodes: string[]
  // ) {
  //   const queries = getSalesQuery(selectedCompanyCodes);
  //   if (!queries) {
  //     return [];
  //   }

  //   const query = queries[queryName];
  //   if (!query) {
  //     throw new Error(`Query "${queryName}" not found.`);
  //   }

  //   const result = await db.getAllAsync(query);
  //   return result;
  // },

  // async getPurchase(
  //   queryName: keyof PurchaseQueries,
  //   selectedCompanyCodes: string[]
  // ) {
  //   const queries = getPurchaseQuery(selectedCompanyCodes);
  //   if (!queries) {
  //     return [];
  //   }

  //   const query = queries[queryName];
  //   if (!query) {
  //     throw new Error(`Query "${queryName}" not found.`);
  //   }

  //   const result = await db.getAllAsync(query);
  //   return result;
  // },

  // async getReceivables(
  //   queryName: keyof ReceivablesQueries,
  //   selectedCompanyCodes: string[]
  // ) {
  //   const queries = getReceivablesQuery(selectedCompanyCodes);
  //   if (!queries) {
  //     return [];
  //   }

  //   const query = queries[queryName];
  //   if (!query) {
  //     throw new Error(`Query "${queryName}" not found.`);
  //   }

  //   const result = await db.getAllAsync(query);
  //   return result;
  // },

  // async getPayables(
  //   queryName: keyof PayablesQueries,
  //   selectedCompanyCodes: string[]
  // ) {
  //   const queries = getPayablesQuery(selectedCompanyCodes);
  //   if (!queries) {
  //     return [];
  //   }

  //   const query = queries[queryName];
  //   if (!query) {
  //     throw new Error(`Query "${queryName}" not found.`);
  //   }

  //   const result = await db.getAllAsync(query);
  //   return result;
  // },
});

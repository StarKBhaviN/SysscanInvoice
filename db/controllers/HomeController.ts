import { HomeQueries } from "@/types/queries.types";
import { SQLiteDatabase } from "expo-sqlite";
import {
  getHomeQueries,
  getPayablesQuery,
  getReceivablesQuery,
} from "../sql_queries";

// controllers/PayablesController.ts

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

export const ReceivablesController = (db: SQLiteDatabase) => ({
  getTotReceived(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getReceivablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getTotReceived, ["REC", from, to]);
  },
  getSummaryByTyp(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getReceivablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getSummaryByTyp, ["REC", from, to]);
  },
  getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    partyName: string,
    from: string,
    to: string
  ) {
    const q = getReceivablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getSummaryDetailsByTyp, [
      "REC",
      partyName,
      from,
      to,
    ]);
  },
  getDetailsByTyp(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getReceivablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getDetailsByTyp, ["REC", from, to]);
  },
});

export const PayablesController = (db: SQLiteDatabase) => ({
  getTotPayment(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getPayablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getTotPayment, ["PMT", from, to]);
  },
  getSummaryByTyp(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getPayablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getSummaryByTyp, ["PMT", from, to]);
  },
  getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    partyName: string,
    from: string,
    to: string
  ) {
    const q = getPayablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getSummaryDetailsByTyp, [
      "PMT",
      partyName,
      from,
      to,
    ]);
  },
  getDetailsByTyp(selectedCompanyCodes: string[], from: string, to: string) {
    const q = getPayablesQuery(selectedCompanyCodes);
    if (!q) return [];
    return db.getAllAsync(q.getDetailsByTyp, ["PMT", from, to]);
  },
});

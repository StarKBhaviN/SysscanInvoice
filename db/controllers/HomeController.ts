import { HomeQueries } from "@/types/queries.types";
import { SQLiteDatabase } from "expo-sqlite";
import {
  getHomeQueries,
  getPayablesQuery,
  getReceivablesQuery,
} from "../sql_queries";

export const HomeController = (db: SQLiteDatabase) => ({
  async getAllHome(
    queryName: keyof HomeQueries,
    selectedCompanyCodes: string[]
  ) {
    try {
      const queries = getHomeQueries(selectedCompanyCodes);
      if (!queries) return [];

      const query = queries[queryName];
      if (!query) {
        throw new Error(`Query "${queryName}" not found.`);
      }

      const result = await db.getAllAsync(query);
      return result;
    } catch (error) {
      console.error("Error in getAllHome:", error);
      return [];
    }
  },

  async getSummaryByTyp(selectedCompanyCodes: string[], typ: string) {
    try {
      console.log("1. Fetching summary by type:", typ);
      const queries = getHomeQueries(selectedCompanyCodes);
      if (!queries) return [];

      const query = queries.getSummaryByTyp;
      if (!query) return [];
      console.log("2. Query QUery : ", query);

      const result = await db.getAllAsync(query, [typ]);
      console.log("2. Summary by type fetched: ");
      return result ?? [];
    } catch (error) {
      console.error("Error in getSummaryByTyp:", error);
      return [];
    }
  },

  async getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    typ: string,
    partyName: string
  ) {
    try {
      console.log("1. Fetching summary details by type:", typ, partyName);
      const queries = getHomeQueries(selectedCompanyCodes);
      if (!queries) return [];

      const query = queries.getSummaryDetailsByTyp;
      const result = await db.getAllAsync(query, [typ, partyName]);
      console.log("2. Summary details by type fetched: ");
      return result;
    } catch (error) {
      console.error("Error in getSummaryDetailsByTyp:", error);
      return [];
    }
  },
  async getDetailsByTyp(selectedCompanyCodes: string[], typ: string) {
    try {
      console.log("1. getDetailsByTyp : Fetching details by type:", typ);
      const queries = getHomeQueries(selectedCompanyCodes);
      console.log("2. Details by type fetched: ");
      if (!queries) return [];

      const query = queries.getDetailsByTyp;
      console.log("3. Query QUery : ", query);
      const result = await db.getAllAsync(query, [typ]);
      console.log("4. Details by type fetched: ", result);
      return result;
    } catch (error) {
      console.error("Error in getDetailsByTyp:", error);
      return [];
    }
  },
});

export const ReceivablesController = (db: SQLiteDatabase) => ({
  async getTotReceived(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. Get total Received : ");
      const q = getReceivablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Get total Received fetched: ");
      return await db.getAllAsync(q.getTotReceived, ["REC", from, to]);
    } catch (error) {
      console.error("Error in getTotReceived:", error);
      return [];
    }
  },

  async getReceivableSummaryByTyp(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. Receivable Get summary by type: ");
      const q = getReceivablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Receivable Get summary by type fetched: ");
      return await db.getAllAsync(q.getReceivableSummaryByTyp, [
        "REC",
        from,
        to,
      ]);
    } catch (error) {
      console.error("Error in getReceivableSummaryByTyp (Receivables):", error);
      return [];
    }
  },

  async getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    partyName: string,
    from: string,
    to: string
  ) {
    try {
      console.log(
        "1. ERROR MIGHT COME :Receivable Get summary details by type:",
        partyName
      );
      const q = getReceivablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Receivable Get summary details by type fetched: ");
      return await db.getAllAsync(q.getSummaryDetailsByTyp, [
        "REC",
        partyName,
        from,
        to,
      ]);
    } catch (error) {
      console.error("Error in getSummaryDetailsByTyp (Receivables):", error);
      return [];
    }
  },

  async getDetailsByTyp(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. ERROR MIGHT COME : Fetching details by type:", from, to);
      const q = getReceivablesQuery(selectedCompanyCodes);
      if (!q) return [];
      return await db.getAllAsync(q.getDetailsByTyp, ["REC", from, to]);
    } catch (error) {
      console.error("Error in getDetailsByTyp (Receivables):", error);
      return [];
    }
  },
});

export const PayablesController = (db: SQLiteDatabase) => ({
  async getTotPayment(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. Get total Payment : ");
      const q = getPayablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Get total Payment fetched: ");
      return await db.getAllAsync(q.getTotPayment, ["PMT", from, to]);
    } catch (error) {
      console.error("Error in getTotPayment:", error);
      return [];
    }
  },

  async getPayableSummaryByTyp(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. Get summary by type: ");
      const q = getPayablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Get summary by type fetched: ");
      return await db.getAllAsync(q.getPayableSummaryByTyp, ["PMT", from, to]);
    } catch (error) {
      console.error("Error in getPayableSummaryByTyp (Payables):", error);
      return [];
    }
  },

  async getSummaryDetailsByTyp(
    selectedCompanyCodes: string[],
    partyName: string,
    from: string,
    to: string
  ) {
    try {
      console.log(
        "1. ERROR MIGHT COME : Payable Get summary details by type:",
        partyName
      );
      const q = getPayablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Payable Get summary details by type fetched: ");
      return await db.getAllAsync(q.getSummaryDetailsByTyp, [
        "PMT",
        partyName,
        from,
        to,
      ]);
    } catch (error) {
      console.error("Error in getSummaryDetailsByTyp (Payables):", error);
      return [];
    }
  },

  async getDetailsByTyp(
    selectedCompanyCodes: string[],
    from: string,
    to: string
  ) {
    try {
      console.log("1. ERROR MIGHT COME : Fetching details by type:", from, to);
      const q = getPayablesQuery(selectedCompanyCodes);
      if (!q) return [];
      console.log("2. Payable Get details by type fetched: ");
      return await db.getAllAsync(q.getDetailsByTyp, ["PMT", from, to]);
    } catch (error) {
      console.error("Error in getDetailsByTyp (Payables):", error);
      return [];
    }
  },
});

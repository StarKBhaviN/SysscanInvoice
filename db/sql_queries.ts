import {
  HomeQueries,
  PayablesQueries,
  PurchaseQueries,
  ReceivablesQueries,
  SalesQueries,
} from "@/types/queries.types";

export const getHeaderCompanyDataQuery = `
  SELECT CMP_CD, CMP_NM FROM a_mst_cmp;
`;

export const getHomeQueries = (
  selectedCompanyCodes: string[]
): HomeQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    getAllHomeData: `
      SELECT 
        TYP,
        COUNT(BILL_NO_SNC_N),
        Sum(QTY1),
        Sum(QTY3),
        Sum(NET_AMT)
      FROM 
        a_trn_spr 
      WHERE 
        CMP_CD in (${codes})
        AND CMP_FY='2425'
        AND BILL_TYP IN ('FINAL') 
      GROUP BY
        TYP
    `,
  };
};

export const getSalesQuery = (
  selectedCompanyCodes: string[]
): SalesQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    getHomeSales: `
      QUERY:: Receivables query
    `,
  };
};

export const getPurchaseQuery = (
  selectedCompanyCodes: string[]
): PurchaseQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    getHomePurchase: `
      QUERY:: Receivables query
    `,
  };
};

export const getReceivablesQuery = (
  selectedCompanyCodes: string[]
): ReceivablesQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    getHomeReceivables: `
      QUERY:: Receivables query
    `,
  };
};

export const getPayablesQuery = (
  selectedCompanyCodes: string[]
): PayablesQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    getHomePayables: `
      QUERY:: Payables query
    `,
  };
};

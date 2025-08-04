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
    getDetailsByTyp: `
      SELECT
        t1.BILL_NO_SNC_N,
        p.ACT_NM AS PartyName,
        b.BRK_NM AS BrokerName,
        t1.QTY1,
        t1.QTY3,
        t1.NET_AMT
      FROM
        a_trn_spr t1
      LEFT JOIN
        a_mst_act p ON t1.PTY_CD = p.ACT_CD 
      LEFT JOIN
        a_mst_brk b ON t1.BRK_CD = b.BRK_CD
      WHERE
        t1.CMP_CD IN (${codes})
        AND t1.CMP_FY = '2425'
        AND t1.BILL_TYP IN ('FINAL')
        AND t1.TYP = ? 
      ORDER BY
        t1.BILL_NO_SNC_N;
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

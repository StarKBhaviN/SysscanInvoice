import {
  HomeQueries,
  PayablesQueries,
  ReceivablesQueries,
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
    getSummaryByTyp: `
      SELECT
        p.ACT_NM AS PartyName,
        SUM(t1.NET_AMT) AS totalNET_AMT,
        SUM(t1.QTY1) AS totalQTY1,
        SUM(t1.QTY3) AS totalQTY3
      FROM
        a_trn_spr t1
      LEFT JOIN
        a_mst_act p ON t1.PTY_CD = p.ACT_CD 
      WHERE
        t1.CMP_CD IN (${codes})
        AND t1.CMP_FY = '2425'
        AND t1.BILL_TYP IN ('FINAL')
        AND t1.TYP = ?
      GROUP BY
        p.ACT_NM
      ORDER BY
        p.ACT_NM;
    `,
    getSummaryDetailsByTyp: `
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
        AND p.ACT_NM = ?
      ORDER BY
        t1.BILL_NO_SNC_N;
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

export const getReceivablesQuery = (
  selectedCompanyCodes: string[]
): ReceivablesQueries | null => {
  if (selectedCompanyCodes.length === 0) return null;
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");

  return {
    // Totals by instrument (BANK/CASH) in a range
    getTotReceived: `
      SELECT 
        TYP,
        ENTR_AS,
        COUNT(ENTR_NO) AS TotalEntries,
        SUM(DOC_AMT) AS TotalAmount
      FROM a_trn_recpmt t
      WHERE 
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      GROUP BY TYP, ENTR_AS;
    `,

    // Summary by Party for a TYP in range
    getSummaryByTyp: `
      SELECT
        p.ACT_NM AS PartyName,
        COUNT(t.ENTR_NO)   AS totalEntries,
        SUM(t.DOC_AMT)     AS totalDOC_AMT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      GROUP BY p.ACT_NM
      ORDER BY p.ACT_NM;
    `,

    // Line items for a specific Party for a TYP in range
    getSummaryDetailsByTyp: `
      SELECT
        t.ENTR_NO,
        p.ACT_NM      AS PartyName,
        t.ENTR_AS,
        t.DOC_AMT,
        t.TRN_DT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND p.ACT_NM = ?
        AND t.TRN_DT BETWEEN ? AND ?
      ORDER BY t.ENTR_NO;
    `,

    // All line items for a TYP in range
    getDetailsByTyp: `
      SELECT
        t.ENTR_NO,
        p.ACT_NM      AS PartyName,
        t.ENTR_AS,
        t.DOC_AMT,
        t.TRN_DT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      ORDER BY t.ENTR_NO;
    `,
  };
};

// PAYABLES (PMT) — identical shape, same table, just pass 'PMT'
export const getPayablesQuery = (
  selectedCompanyCodes: string[]
): PayablesQueries | null => {
  if (selectedCompanyCodes.length === 0) return null;
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");

  return {
    getTotPayment: `
      SELECT 
        TYP,
        ENTR_AS,
        COUNT(ENTR_NO) AS TotalEntries,
        SUM(DOC_AMT)   AS TotalAmount
      FROM a_trn_recpmt t
      WHERE 
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      GROUP BY TYP, ENTR_AS;
    `,
    getSummaryByTyp: `
      SELECT
        p.ACT_NM AS PartyName,
        COUNT(t.ENTR_NO)   AS totalEntries,
        SUM(t.DOC_AMT)     AS totalDOC_AMT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      GROUP BY p.ACT_NM
      ORDER BY p.ACT_NM;
    `,
    getSummaryDetailsByTyp: `
      SELECT
        t.ENTR_NO,
        p.ACT_NM      AS PartyName,
        t.ENTR_AS,
        t.DOC_AMT,
        t.TRN_DT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND p.ACT_NM = ?
        AND t.TRN_DT BETWEEN ? AND ?
      ORDER BY t.ENTR_NO;
    `,
    getDetailsByTyp: `
      SELECT
        t.ENTR_NO,
        p.ACT_NM      AS PartyName,
        t.ENTR_AS,
        t.DOC_AMT,
        t.TRN_DT
      FROM a_trn_recpmt t
      LEFT JOIN a_mst_act p ON t.PTY_CD = p.ACT_CD
      WHERE
        t.CMP_CD IN (${codes})
        AND t.TYP = ?
        AND t.TRN_DT BETWEEN ? AND ?
      ORDER BY t.ENTR_NO;
    `,
  };
};

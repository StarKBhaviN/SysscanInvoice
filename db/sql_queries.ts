export type SalesQueries = {
  testSales: string;
  getHomeSales: string;
  getTopSellingItems: string;
};

export const HomeQueries = {
  getHome: `
        SELECT CMP_CD, CMP_NM FROM a_mst_cmp;
    `,
};

export const getSalesQuery = (
  selectedCompanyCodes: string[]
): SalesQueries | null => {
  if (selectedCompanyCodes.length === 0) {
    return null;
  }
  const codes = selectedCompanyCodes.map((c) => `'${c}'`).join(",");
  return {
    testSales: `
    SELECT CMP_CD, TYP FROM a_trn_spr WHERE CMP_CD IN (${codes}) LIMIT 5;
  `,
    getHomeSales: `
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
        AND TYP IN ('SAL','EXP','GSL','JWI') 
        AND BILL_TYP IN ('FINAL') 
      GROUP BY TYP
    `,
    getTopSellingItems: `
      SELECT 
        ITEM_CD,
        COUNT(BILL_NO_SNC_N),
        Sum(QTY1),
        Sum(QTY3),
        Sum(NET_AMT)
      FROM 
        a_trn_spr 
      WHERE 
        CMP_CD='A04'
        AND CMP_FY='2425'
        AND TYP IN ('SAL','EXP','GSL','JWI') 
        AND BILL_TYP IN ('FINAL') 
      GROUP BY ITEM_CD
      ORDER BY COUNT(BILL_NO_SNC_N) DESC
      LIMIT 5
    `,
  };
};

export const PurchaseQueries = {
  getPurchase: `
        SELECT * FROM purchase;
    `,
};

export const InventoryQueries = {
  getInventory: `
        SELECT * FROM inventory;
    `,
};

export const HomeQueries = {
  getHome: `
        SELECT CMP_CD, CMP_NM FROM a_mst_cmp;
    `,
};

export const SalesQueries = {
  getSales: `
        SELECT * FROM sales;
    `,
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

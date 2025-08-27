export type HomeQueries = {
  getAllHomeData: string;
  getSummaryByTyp: string;
  getSummaryDetailsByTyp: string;
  getDetailsByTyp: string;
};
export type SalesQueries = {
  getHomeSales: string;
};

export type PurchaseQueries = {
  getHomePurchase: string;
};

export type ReceivablesQueries = {
  getTotReceived: string;
  getReceivableSummaryByTyp: string;
  getSummaryDetailsByTyp: string;
  getDetailsByTyp: string;
};

export type PayablesQueries = {
  getTotPayment: string;
  getPayableSummaryByTyp: string;
  getSummaryDetailsByTyp: string;
  getDetailsByTyp: string;
};

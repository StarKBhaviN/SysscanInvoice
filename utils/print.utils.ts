export interface PrintSettings {
  printWhat: string;
  invoiceAs: string;
  partyName: string;
  pageFormat: string;
  copies: string;
  printPaper: string;
  printDestination: string;
}

export const defaultSettings: PrintSettings = {
  printWhat: "Sales Invoice",
  invoiceAs: "TAX",
  partyName: "All",
  pageFormat: "A4",
  copies: "2",
  printPaper: "Plain",
  printDestination: "Screen",
};

export const printWhatOptions = [
  "Sales Invoice",
  "Purchase Invoice",
  "Credit Note",
  "Debit Note",
];

export const invoiceAsOptions = ["TAX", "RETAIL"];

export const partyNameOptions = ["All", "Selected"];

export const pageFormatOptions = ["A4", "A5", "Letter"];

export const printPaperOptions = ["Plain", "Pre-printed"];

export const printDestinationOptions = ["Screen", "Printer"];

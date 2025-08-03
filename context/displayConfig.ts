import { Entypo, Feather } from "@expo/vector-icons";

type IconName =
  | React.ComponentProps<typeof Entypo>["name"]
  | React.ComponentProps<typeof Feather>["name"];

type DisplayConfigItem = {
  type: string;
  name: string;
  IconComponent: typeof Entypo | typeof Feather;
  iconName: IconName;
};

export const displayConfig: DisplayConfigItem[] = [
  // Row 1
  { type: "SAL", name: "Sales", IconComponent: Entypo, iconName: "bar-graph" },
  { type: "PUR", name: "Purchase", IconComponent: Entypo, iconName: "layers" },
  // Row 3
  {
    type: "JWI",
    name: "Job Work Income",
    IconComponent: Entypo,
    iconName: "briefcase",
  },
  {
    type: "JWP",
    name: "Job Work Payment",
    IconComponent: Entypo,
    iconName: "tools",
  },
  // Row 4
  // { type: "EXD", name: "Exports", IconComponent: Entypo, iconName: "globe" },
  { type: "GSL", name: "General Sale", IconComponent: Entypo, iconName: "tag" },
  {
    type: "GEN",
    name: "General Purchase",
    IconComponent: Entypo,
    iconName: "archive",
  },
  // Row 5
  {
    type: "SRT",
    name: "Sales Return",
    IconComponent: Feather,
    iconName: "corner-up-left",
  },
  {
    type: "PDN",
    name: "Purchase Return",
    IconComponent: Feather,
    iconName: "corner-up-right",
  },
  // Row 6
  {
    type: "CRN",
    name: "Credit Note",
    IconComponent: Feather,
    iconName: "file-minus",
  },
  {
    type: "DBN",
    name: "Debit Note",
    IconComponent: Feather,
    iconName: "file-plus",
  },
  // Other categories
  {
    type: "CGR",
    name: "Credit Note (Gen)",
    IconComponent: Feather,
    iconName: "file-minus",
  },
  {
    type: "DGR",
    name: "Debit Note (Gen)",
    IconComponent: Feather,
    iconName: "file-plus",
  },
  // Row 2
  {
    type: "Receivables",
    name: "Receivable",
    IconComponent: Feather,
    iconName: "arrow-down-left",
  },
  {
    type: "Payables",
    name: "Payables",
    IconComponent: Feather,
    iconName: "arrow-up-right",
  },
];

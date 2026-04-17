import type { LucideIcon } from "lucide-react";

export type SettingsTab = "account" | "enterprise" | "preferences";
export type ConventionSource = "naf" | "custom";
export type AuthProvider = "GOOGLE";
export type GoogleConnectionPanelMode =
  | "hidden"
  | "google_only"
  | "google_with_password";
export type AccountConfirmationModal =
  | "two_factor"
  | "export_data"
  | "delete_account";

export type AccountProfile = {
  prenom: string;
  nom: string;
  email: string;
  isVerified: boolean;
  cgu: boolean;
};

export type AccountProvider = {
  provider: AuthProvider;
  googleConnectionPanelMode: GoogleConnectionPanelMode;
} | null;

export type ConventionCollectiveOption = {
  key: string;
  name: string;
  idccCode: string | null;
  source: ConventionSource;
};

export type EnterpriseSettings = {
  name: string | null;
  siren: string | null;
  codeNaf: string | null;
  intituleNaf: string | null;
  statusJuridiqueCode: string | null;
  statusJuridique: string | null;
  selectedIdccKey: string | null;
  idccSelections: ConventionCollectiveOption[];
  address: {
    address: string | null;
    codePostal: string | null;
    pays: string | null;
  } | null;
};

export type InseePreviewResponse = {
  success: boolean;
  message?: string;
  data?: {
    siren: string | null;
    codeNaf: string | null;
    intituleNaf: string | null;
    name: string | null;
    statusJuridiqueCode: string | null;
    statusJuridique: string | null;
    address: EnterpriseSettings["address"];
    idccSelections: ConventionCollectiveOption[];
    selectedIdccKey: string | null;
  };
};

export type SettingsTabItem = {
  id: SettingsTab;
  label: string;
  icon: LucideIcon;
  description: string;
};

export type ConfirmationModalContent = {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName?: string;
  onConfirm: () => void;
};

import type {
  AccountConfirmationModal,
  ConfirmationModalContent,
  EnterpriseSettings,
} from "../../types/paramSettings";

export function createEmptyEnterpriseSettings(): EnterpriseSettings {
  return {
    name: "",
    siren: "",
    codeNaf: "",
    intituleNaf: "",
    statusJuridiqueCode: "",
    statusJuridique: "",
    selectedIdccKey: null,
    idccSelections: [],
    address: {
      address: "",
      codePostal: "",
      pays: "",
    },
  };
}

export function cloneEnterpriseSettings(
  enterprise: EnterpriseSettings,
): EnterpriseSettings {
  return {
    ...enterprise,
    idccSelections: enterprise.idccSelections.map((selection) => ({
      ...selection,
    })),
    address: enterprise.address ? { ...enterprise.address } : null,
  };
}

export function getSelectedConventionLabel(enterprise: EnterpriseSettings) {
  const selectedConvention = enterprise.idccSelections.find(
    (selection) => selection.key === enterprise.selectedIdccKey,
  );

  if (!selectedConvention) {
    return "—";
  }

  return `${selectedConvention.name}${
    selectedConvention.idccCode ? ` - IDCC ${selectedConvention.idccCode}` : ""
  }${selectedConvention.source === "custom" ? " (custom)" : ""}`;
}

export function hasEnterpriseDisplayData(enterprise: EnterpriseSettings) {
  return Boolean(
    enterprise.name?.trim() ||
      enterprise.siren?.trim() ||
      enterprise.codeNaf?.trim() ||
      enterprise.intituleNaf?.trim() ||
      enterprise.statusJuridiqueCode?.trim() ||
      enterprise.statusJuridique?.trim() ||
      enterprise.address?.address?.trim() ||
      enterprise.address?.codePostal?.trim() ||
      enterprise.address?.pays?.trim(),
  );
}

export function getParamConfirmationModalContent({
  activeConfirmationModal,
  onClose,
  onTwoFactorConfirm,
}: {
  activeConfirmationModal: AccountConfirmationModal | null;
  onClose: () => void;
  onTwoFactorConfirm: () => void;
}): ConfirmationModalContent | null {
  switch (activeConfirmationModal) {
    case "two_factor":
      return {
        title: "Authentification à deux facteurs",
        description:
          "À chaque connexion, vous recevrez un code par email que vous devrez renseigner pour accéder à votre compte.",
        confirmLabel: "Je comprends",
        confirmClassName: "bg-lumenjuris text-white hover:bg-lumenjuris/90",
        onConfirm: () => {
          onTwoFactorConfirm();
          onClose();
        },
      };
    case "export_data":
      return {
        title: "Exporter mes données",
        description:
          "Vous recevrez prochainement un email contenant toutes les informations liées à votre compte.",
        confirmLabel: "Exporter mes données",
        confirmClassName: "bg-lumenjuris text-white hover:bg-lumenjuris/90",
        onConfirm: onClose,
      };
    case "delete_account":
      return {
        title: "Supprimer mon compte",
        description:
          "Vous recevrez un email de confirmation et cette action entraînera la suppression de toutes vos données.",
        confirmLabel: "Supprimer mon compte",
        confirmClassName: "bg-red-600 text-white hover:bg-red-700",
        onConfirm: onClose,
      };
    default:
      return null;
  }
}

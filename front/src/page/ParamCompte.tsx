import { useLayoutEffect, useRef, useState } from "react";
import { SETTINGS_TABS } from "../config/paramSettings";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useEnterpriseSettings } from "../hooks/useEnterpriseSettings";
import { AccountSettingsPanel } from "../components/ParamComponents/AccountSettingsPanel";
import { EnterpriseSettingsPanel } from "../components/ParamComponents/EnterpriseSettingsPanel";
import { ParamLayout } from "../components/ParamComponents/ParamLayout";
import { PreferenceSettingsPanel } from "../components/ParamComponents/PreferenceSettingsPanel";
import { ConfirmationModal } from "../components/ui/ConfirmationModal";
import type {
  AccountConfirmationModal,
  AccountProfile,
  AccountProvider,
  SettingsTab,
} from "../types/paramSettings";
import { getParamConfirmationModalContent } from "../utils/param/paramSettings";

export function ParamCompte() {
  const storagePrefix = "param-settings-account";

  // Etat local temporaire en attendant le branchement sur la vraie donnée BDD.
  const [activeTab, setActiveTab] = useLocalStorageState<SettingsTab>(
    `${storagePrefix}:active-tab`,
    "account",
  );
  const [panelMinHeight, setPanelMinHeight] = useState<number | null>(null);
  const [accountProfile, setAccountProfile] =
    useLocalStorageState<AccountProfile>(`${storagePrefix}:profile`, {
      prenom: "",
      nom: "",
      email: "",
      isVerified: false,
      cgu: false,
    });
  // MDP exclus du LocalStorage
  const [accountPassword, setAccountPassword] = useState("");
  const [accountProvider] = useLocalStorageState<AccountProvider>(
    `${storagePrefix}:provider`,
    {
      provider: "GOOGLE",
      googleConnectionPanelMode: "google_only",
    },
  );
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] =
    useLocalStorageState<boolean>(`${storagePrefix}:two-factor`, false);
  const [activeConfirmationModal, setActiveConfirmationModal] =
    useState<AccountConfirmationModal | null>(null);
  const [isDyslexicModeEnabled, setIsDyslexicModeEnabled] =
    useLocalStorageState<boolean>(`${storagePrefix}:dyslexic-mode`, false);

  const enterprise = useEnterpriseSettings();

  const accountMeasureRef = useRef<HTMLElement>(null);
  const enterpriseMeasureRef = useRef<HTMLElement>(null);
  const preferenceMeasureRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const measurePanels = () => {
      if (window.innerWidth < 768) {
        setPanelMinHeight((current) => (current === null ? current : null));
        return;
      }

      const heights = [
        accountMeasureRef.current?.offsetHeight ?? 0,
        enterpriseMeasureRef.current?.offsetHeight ?? 0,
        preferenceMeasureRef.current?.offsetHeight ?? 0,
      ];
      const nextHeight = Math.max(...heights);

      setPanelMinHeight((current) =>
        current === nextHeight ? current : nextHeight,
      );
    };

    measurePanels();
    window.addEventListener("resize", measurePanels);

    return () => {
      window.removeEventListener("resize", measurePanels);
    };
  }, [
    accountPassword,
    accountProfile,
    accountProvider,
    enterprise.enterpriseDraft,
    enterprise.enterpriseSettings,
    enterprise.inseeLookupSiren,
    enterprise.inseePrefillError,
    enterprise.isEditingEnterprise,
    enterprise.isPrefillingFromSiren,
    isDyslexicModeEnabled,
    isTwoFactorEnabled,
  ]);

  const handleProfileFieldChange = (
    field: "prenom" | "nom" | "email",
    value: string,
  ) => {
    setAccountProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleTwoFactorCheckedChange = (checked: boolean) => {
    if (checked) {
      setActiveConfirmationModal("two_factor");
      return;
    }

    setIsTwoFactorEnabled(false);
  };

  const handleTabChange = (nextTab: SettingsTab) => {
    if (nextTab === activeTab) {
      return;
    }

    // On annule le brouillon entreprise si on quitte l'onglet en cours d'édition.
    if (
      activeTab === "enterprise" &&
      nextTab !== "enterprise" &&
      enterprise.isEditingEnterprise
    ) {
      enterprise.handleCancelEnterpriseEdit();
    }

    setActiveConfirmationModal(null);
    setActiveTab(nextTab);
  };

  const confirmationModalContent = getParamConfirmationModalContent({
    activeConfirmationModal,
    onClose: () => setActiveConfirmationModal(null),
    onTwoFactorConfirm: () => setIsTwoFactorEnabled(true),
  });

  const accountPanel = (
    <AccountSettingsPanel
      profile={accountProfile}
      password={accountPassword}
      provider={accountProvider}
      isTwoFactorEnabled={isTwoFactorEnabled}
      onProfileFieldChange={handleProfileFieldChange}
      onPasswordChange={setAccountPassword}
      onTwoFactorCheckedChange={handleTwoFactorCheckedChange}
      onExportDataClick={() => setActiveConfirmationModal("export_data")}
      onDeleteAccountClick={() => setActiveConfirmationModal("delete_account")}
    />
  );

  const enterprisePanel = (
    <EnterpriseSettingsPanel
      enterpriseSettings={enterprise.enterpriseSettings}
      enterpriseDraft={enterprise.enterpriseDraft}
      isEditingEnterprise={enterprise.isEditingEnterprise}
      onEditEnterprise={enterprise.handleEditEnterprise}
      onCancelEnterpriseEdit={enterprise.handleCancelEnterpriseEdit}
      onSaveEnterpriseEdit={enterprise.handleSaveEnterpriseEdit}
      onEnterpriseFieldChange={enterprise.handleEnterpriseFieldChange}
      onEnterpriseAddressFieldChange={
        enterprise.handleEnterpriseAddressFieldChange
      }
      shouldShowInseePrefill={enterprise.shouldShowInseePrefill}
      inseeLookupSiren={enterprise.inseeLookupSiren}
      onInseeLookupSirenChange={enterprise.handleInseeLookupSirenChange}
      canTriggerInseePrefill={enterprise.canTriggerInseePrefill}
      isPrefillingFromSiren={enterprise.isPrefillingFromSiren}
      inseePrefillError={enterprise.inseePrefillError}
      onPrefillFromSiren={enterprise.handlePrefillFromSiren}
    />
  );

  const preferencePanel = (
    <PreferenceSettingsPanel
      isDyslexicModeEnabled={isDyslexicModeEnabled}
      onDyslexicModeCheckedChange={setIsDyslexicModeEnabled}
    />
  );

  return (
    <>
      <ParamLayout
        title="Mes Paramètres"
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        panelMinHeight={panelMinHeight}
        accountMeasureRef={accountMeasureRef}
        enterpriseMeasureRef={enterpriseMeasureRef}
        preferenceMeasureRef={preferenceMeasureRef}
        accountMeasurePanel={accountPanel}
        enterpriseMeasurePanel={enterprisePanel}
        preferenceMeasurePanel={preferencePanel}
      >
        {activeTab === "account"
          ? accountPanel
          : activeTab === "enterprise"
            ? enterprisePanel
            : preferencePanel}
      </ParamLayout>

      {confirmationModalContent ? (
        <ConfirmationModal
          open
          title={confirmationModalContent.title}
          description={confirmationModalContent.description}
          confirmLabel={confirmationModalContent.confirmLabel}
          confirmClassName={confirmationModalContent.confirmClassName}
          onCancel={() => setActiveConfirmationModal(null)}
          onConfirm={confirmationModalContent.onConfirm}
        />
      ) : null}
    </>
  );
}

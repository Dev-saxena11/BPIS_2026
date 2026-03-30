import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import AlertsPanel from "../components/AlertsPanel";

const DistrictAlerts = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: "30px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 className="gov-heading" style={{ fontSize: "2rem", marginBottom: "12px" }}>
        {t("pageDistrictAlerts")}
      </h1>
      <p style={{ marginTop: 0, marginBottom: "28px", color: "#64748b" }}>
        Review unusual district patterns in literacy, population pressure, and priority score in one place.
      </p>
      <AlertsPanel />
    </div>
  );
};

export default DistrictAlerts;

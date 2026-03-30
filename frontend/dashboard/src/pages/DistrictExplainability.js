import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import SchemeExplainabilityPanel from "../components/SchemeExplainabilityPanel";

const DistrictExplainability = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: "30px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 className="gov-heading" style={{ fontSize: "2rem", marginBottom: "12px" }}>
        {t("pageDistrictExplainability")}
      </h1>
      <p style={{ marginTop: 0, marginBottom: "28px", color: "#64748b" }}>
        See why specific schemes were recommended and which district signals triggered them.
      </p>
      <SchemeExplainabilityPanel />
    </div>
  );
};

export default DistrictExplainability;

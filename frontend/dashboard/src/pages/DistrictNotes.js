import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import DistrictNotesPanel from "../components/DistrictNotesPanel";

const DistrictNotes = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: "30px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 className="gov-heading" style={{ fontSize: "2rem", marginBottom: "12px" }}>
        {t("pageDistrictNotes")}
      </h1>
      <p style={{ marginTop: 0, marginBottom: "28px", color: "#64748b" }}>
        Add internal comments, tags, and action items for the selected district.
      </p>
      <DistrictNotesPanel />
    </div>
  );
};

export default DistrictNotes;

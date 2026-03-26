import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div style={{
      background:"#0f172a",
      color:"white",
      padding:"10px 20px",
      fontSize:"20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>{t("appTitle")}</div>
      
      <button 
        onClick={toggleLanguage}
        style={{
          background: "transparent",
          color: "white",
          border: "1px solid #475569",
          padding: "6px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          transition: "all 0.2s"
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = "#334155"}
        onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
      >
        {language === 'en' ? 'EN | HI' : 'HI | EN'}
      </button>
    </div>
  );
}

export default Navbar;
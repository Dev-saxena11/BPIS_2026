import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar({ isSidebarExpanded }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div style={{
      background:"#0f172a",
      color:"white",
      padding:"10px 20px",
      fontSize:"20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      zIndex: 1
    }}>
      <div style={{ paddingLeft: isSidebarExpanded ? "0px" : "70px", transition: "padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>{t("appTitle")}</div>
      
      <div 
  onClick={toggleLanguage}
  style={{
    width: '85px', // Slightly wider for better movement range
    height: '38px',
    backgroundColor: '#f97316',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer',
    padding: '4px',
    transition: 'background-color 0.4s ease', // Smooth color shift
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' // Inner shadow for depth
  }}
>
  {/* The Sliding White Pill */}
  <div style={{
    position: 'absolute',
    width: '40px',
    height: '30px',
    backgroundColor: 'white',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    
    // --- MAGIC HAPPENS HERE ---
    // Cubic-bezier gives it that 'pop' and 'snap' feel
    transition: 'transform 0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 0.3s ease',
    
    // Smooth transform logic
    transform: language === 'en' ? 'translateX(37px)' : 'translateX(0px)',
    
    // Add a shadow that moves with the pill
    boxShadow: '0 4px 6px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <span style={{ 
      color: '#f97316', 
      fontSize: '13px', 
      fontWeight: '800',
      transition: 'opacity 0.2s ease' 
    }}>
      {language === 'en' ? 'EN' : 'HI'}
    </span>
  </div>

  {/* Background Labels */}
  <div style={{ 
    flex: 1, 
    display: 'flex', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    zIndex: 1,
    userSelect: 'none' // Prevent text selection on rapid clicks
  }}>
    <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', opacity: language === 'hi' ? 0.3 : 0.8 }}>HI</span>
    <span style={{ color: 'white', fontSize: '12px', fontWeight: '700', opacity: language === 'en' ? 0.3 : 0.8 }}>EN</span>
  </div>
</div>
    </div>
  );
}

export default Navbar;

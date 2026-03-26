import React from 'react';
import MapView from "../components/MapView";
import SummaryCards from "../components/SummaryCards";
import { useLanguage } from '../contexts/LanguageContext';

const Overview = () => {
  const { t } = useLanguage();

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 className="gov-heading" style={{ fontSize: '2rem', marginBottom: '30px' }}>{t("pageOverview")}</h1>
      
      <div className="gov-card">
        <h2 className="gov-heading">{t("nationalDistrictView")}</h2>
        <MapView />
      </div>

      <div className="gov-card" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
        <SummaryCards />
      </div>
    </div>
  );
};

export default Overview;

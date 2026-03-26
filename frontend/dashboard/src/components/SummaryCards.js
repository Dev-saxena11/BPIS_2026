import { useEffect, useState } from "react";
import { useLanguage } from '../contexts/LanguageContext';
import axios from "axios";

function SummaryCards() {
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    lowLiteracy: 0,
    highestRisk: "",
    avgLiteracy: 0
  });

  useEffect(() => {

    axios.get("http://localhost:8000/districts")
      .then(res => {

        const districts = res.data;

        const lowLiteracy = districts.filter(
          d => d.literacy_rate < 70
        ).length;

        const avgLiteracy =
          districts.reduce((sum,d)=>sum+d.literacy_rate,0) /
          districts.length;

        setStats(prev => ({
          ...prev,
          lowLiteracy: lowLiteracy,
          avgLiteracy: avgLiteracy.toFixed(2)
        }));

      });

    axios.get("http://localhost:8000/priority-ranking")
      .then(res => {

        const highestRisk =
          res.data.sort((a,b)=>b.priority_score-a.priority_score)[0];

        setStats(prev => ({
          ...prev,
          highestRisk: highestRisk.district
        }));

      });

  }, []);

  return (

    <div style={{
      display:"flex",
      gap:"20px",
      marginTop:"20px"
    }}>

      <div style={cardStyle}>
        <h4>{t('lowLiteracyDistricts')}</h4>
        <p style={numberStyle}>{stats.lowLiteracy}</p>
      </div>

      <div style={cardStyle}>
        <h4>{t('highestRiskDistrict')}</h4>
        <p style={{...numberStyle, textTransform: 'capitalize'}}>{(t('districtNameMap') && stats.highestRisk && t('districtNameMap')[stats.highestRisk.toLowerCase()]) || stats.highestRisk}</p>
      </div>

      <div style={cardStyle}>
        <h4>{t('averageLiteracy')}</h4>
        <p style={numberStyle}>{stats.avgLiteracy}%</p>
      </div>

    </div>

  );

}

const cardStyle = {
  background:"#ffffff",
  border:"1px solid #e5e7eb",
  padding:"20px",
  borderRadius:"8px",
  flex:1,
  textAlign:"center",
  boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
};

const numberStyle = {
  fontSize:"34px",
  fontWeight:"bold"
};

export default SummaryCards;
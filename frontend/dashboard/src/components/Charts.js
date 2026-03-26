import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

function Charts() {
  const { t } = useLanguage();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/priority-ranking")
      .then(res => {
        const top = res.data
          .sort((a, b) => b.priority_score - a.priority_score)
          .slice(0, 10);
        setData(top);
      });
  }, []);

  // Translate a district name using the map, with capitalization fallback
  const getDistrictLabel = (val) => {
    const nameMap = t('districtNameMap');
    const mapped = (nameMap && nameMap[val?.toLowerCase()]) ? nameMap[val.toLowerCase()] : val;
    return mapped?.charAt(0).toUpperCase() + mapped?.slice(1);
  };

  // Custom tooltip: translates the key label and formats priority_score to 2 decimals
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', color: '#1e293b' }}>
          <p style={{ fontWeight: 700, marginBottom: '4px' }}>{getDistrictLabel(label)}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color, margin: '2px 0' }}>
              {t('priorityScore')}: <strong>{Number(entry.value).toFixed(2)}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>{t('topPriorityDistricts')}</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="district" tickFormatter={getDistrictLabel} />
          <YAxis dataKey="priority_score" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="priority_score" fill="#e74c3c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;

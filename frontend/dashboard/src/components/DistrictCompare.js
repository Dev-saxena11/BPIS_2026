import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Sparkles, BrainCircuit, Search, ChevronDown, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useLanguage } from '../contexts/LanguageContext';
import { notoSansDevanagariBase64 } from '../assets/fontBase64';

const CustomSearchableSelect = ({ data, selectedValue, onChange }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = searchTerm.trim() === '' 
    ? data 
    : data.filter(d => d.district.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', minWidth: '320px' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text"
          placeholder={selectedValue || t("searchDistrictPlaceholder")}
          value={isOpen ? searchTerm : selectedValue}
          onFocus={() => { setIsOpen(true); setSearchTerm(''); }}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          style={{ width: '100%', padding: '12px 16px', paddingRight: '40px', borderRadius: '8px', border: isOpen ? '2px solid #0f172a' : '2px solid #cbd5e1', fontSize: '1.05rem', outline: 'none', backgroundColor: '#ffffff', fontWeight: 600, color: '#0f172a', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
          {isOpen ? <Search size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', 
          backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', 
          maxHeight: '300px', overflowY: 'auto', zIndex: 1000, 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
        }}>
          {filteredData.length > 0 ? filteredData.map(d => (
            <div 
              key={d.district}
              onClick={() => {
                onChange(d.district);
                setIsOpen(false);
                setSearchTerm('');
              }}
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontSize: '1rem', fontWeight: 500 }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#ea580c'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#1e293b'; }}
            >
              {d.district}
            </div>
          )) : (
            <div style={{ padding: '12px 16px', color: '#64748b', textAlign: 'center' }}>No districts matching '{searchTerm}'</div>
          )}
        </div>
      )}
    </div>
  )
}

const DistrictCompare = () => {
  const [data, setData] = useState([]);
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const { t, language } = useLanguage();
  
  useEffect(() => {
    axios.get("http://localhost:8000/priority-ranking").then(res => {
      setData(res.data);
    });
  }, []);

  if (!data.length) return null;

  // Calculate generic National Averages
  const nationalLiteracy = data.reduce((acc, d) => acc + (d.literacy_rate || 0), 0) / data.length;
  const nationalDensity = 382; 
  const nationalGenderRatio = 943; 

  const getDistrictData = (name) => data.find(d => d.district === name);
  const selectedData = getDistrictData(selectedDistrictName);
  // Helper to safely format district name explicitly
  const getDistrictName = (name) => {
    if (!name) return "";
    const nameMap = t('districtNameMap');
    if (nameMap && nameMap[name.toLowerCase()]) {
      return nameMap[name.toLowerCase()];
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };


  // Mock consistent value generators
  const getMockedMetric = (name, base) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return base + (hash % (base * 0.15)); // +/- 15% variance
  };

  const currentLiteracy = selectedData?.literacy_rate || 0;
  const currentDensity = selectedDistrictName ? getMockedMetric(selectedDistrictName, 350) : 0;
  const currentGenderRatio = selectedDistrictName ? getMockedMetric(selectedDistrictName, 900) : 0;

  const barData = selectedDistrictName ? [
    { name: t('literacyRate'), [selectedDistrictName]: currentLiteracy, [t('nationalAverage')]: nationalLiteracy }
  ] : [];

  const radarData = selectedDistrictName ? [
    { subject: t('literacyRate'), A: currentLiteracy, B: nationalLiteracy, fullMark: 100 },
    { subject: t('density'), A: currentDensity/4, B: nationalDensity/4, fullMark: 100 },
    { subject: t('genderRatio'), A: currentGenderRatio/10, B: nationalGenderRatio/10, fullMark: 100 }
  ] : [];

  const gap = nationalLiteracy - currentLiteracy;

  // --- PDF REPORT GENERATOR ---
  const handleDownloadReport = () => {
    if (!selectedData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    if (language === 'hi') {
      doc.addFileToVFS('NotoSansDevanagari-Regular.ttf', notoSansDevanagariBase64);
      doc.addFont('NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari', 'normal');
      doc.setFont('NotoSansDevanagari');
    }

    // Gov Letterhead Outline
    doc.setDrawColor(15, 23, 42); 
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    const setFontSafe = (weight) => {
        if (language === 'hi') {
            doc.setFont('NotoSansDevanagari', 'normal');
        } else {
            doc.setFont('helvetica', weight);
        }
    };

    // Official Title Header
    doc.setTextColor(15, 23, 42);
    setFontSafe('bold');
    doc.setFontSize(16);
    doc.text(t("reportHeader"), pageWidth / 2, 25, { align: "center" });

    // Auto-Timestamp
    setFontSafe('normal');
    doc.setFontSize(10);
    doc.text(`${t("generatedOn")}: ${new Date().toLocaleString()}`, pageWidth / 2, 32, { align: "center" });

    // Section Bar
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.line(20, 40, pageWidth - 20, 40);

    // District Table
    doc.setFontSize(14);
    setFontSafe('bold');
    doc.setTextColor(234, 88, 12); // BPIS Orange
    doc.text(`${t("districtProfile")}: `, 20, 52);
    const titleWidth = doc.getTextWidth(`${t("districtProfile")}: `);
    doc.setFont('helvetica', 'bold');
    const pDName = getDistrictName(selectedDistrictName);
    if (/[a-zA-Z]/.test(pDName)) {
        doc.setFont('helvetica', 'bold');
    } else {
        if (language === 'hi') {
            doc.setFont('NotoSansDevanagari', 'normal');
        }
    }
    doc.text(pDName, 20 + titleWidth, 52);

    autoTable(doc, {
      startY: 56,
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 0) {
          if (/[a-zA-Z]/.test(data.cell.raw)) {
             data.cell.styles.font = 'helvetica';
          }
        }
      },
      head: [[t("districtName"), t("totalPopulation"), t("literacyRate")]],
      body: [
        [
          getDistrictName(selectedData.district), 
          selectedData.population?.toLocaleString() || 'N/A', 
          selectedData.literacy_rate?.toFixed(2) || 'N/A'
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'normal' },
      styles: { 
          font: language === 'hi' ? 'NotoSansDevanagari' : 'helvetica', 
          fontStyle: 'normal',
          fontSize: 11, 
          cellPadding: 6 
      },
      margin: { left: 20, right: 20 }
    });

    // AI Policy Recommendation Section
    const nextY = doc.lastAutoTable.finalY + 15 || 95;
    
    doc.setFontSize(14);
    setFontSafe('bold');
    doc.setTextColor(234, 88, 12);
    doc.text(t("strategicAdvice"), 20, nextY);

    doc.setFontSize(11);
    setFontSafe('normal');
    doc.setTextColor(15, 23, 42);
    
    // Dynamic bullet math
    const gapLiteral = Math.abs(gap).toFixed(1);
    const popText = selectedData.population ? (selectedData.population / 1000000).toFixed(1) + "M" : "the regional";
    
    const bullet1 = gap > 0 
      ? t("bullet1Gap").replace("{{gap}}", gapLiteral) 
      : t("bullet1Surplus").replace("{{gap}}", gapLiteral);
    const bullet2 = t("bullet2").replace("{{pop}}", popText);
    const bullet3 = t("bullet3");

    doc.text(bullet1, 20, nextY + 10);
    doc.text(bullet2, 20, nextY + 18);
    doc.text(bullet3, 20, nextY + 26);

    // Official Footer Mark
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(t("confidentialFooter"), pageWidth / 2, pageHeight - 15, { align: "center" });

    // Auto-Download trigger
    doc.save(`BPIS_Report_${selectedDistrictName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="gov-card" style={{ background: '#ffffff', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="gov-heading" style={{ margin: 0, fontSize: '1.5rem' }}>{t('districtCompareTitle')}</h2>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {selectedData && (
            <button 
              onClick={handleDownloadReport}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#ea580c', color: 'white', border: 'none',
                padding: '12px 20px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#c2410c'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#ea580c'}
            >
              <FileText size={20} /> {t('exportPDFBtn')}
            </button>
          )}

          <CustomSearchableSelect 
            data={data}
            selectedValue={selectedDistrictName}
            onChange={setSelectedDistrictName}
          />
        </div>
      </div>

      {selectedData ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
          
          {/* Charts Column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '16px', textAlign: 'center' }}>{selectedDistrictName} {t('vsNationalSetup')}</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 40, left: 20, bottom: 30 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar name={getDistrictName(selectedDistrictName)} dataKey={selectedDistrictName} fill="#ea580c" radius={[4, 4, 0, 0]} />
                    <Bar dataKey={t('nationalAverage')} fill="#1e293b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '16px', textAlign: 'center' }}>{t('socioEconomicRadar')}</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={getDistrictName(selectedDistrictName)} dataKey="A" stroke="#ea580c" fill="#ea580c" fillOpacity={0.6} />
                    <Radar name={t('nationalAverage')} dataKey="B" stroke="#1e293b" fill="#1e293b" fillOpacity={0.4} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>

          {/* AI Insight Column */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', 
              border: '1px solid #fdba74', 
              borderRadius: '12px', 
              padding: '28px', 
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#ea580c', padding: '8px', borderRadius: '8px' }}>
                  <Sparkles size={24} color="white" />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#9a3412', margin: 0, fontWeight: 800 }}>{t('aiPolicyInsight')}</h3>
              </div>
              
              <p style={{ fontSize: '1.25rem', color: '#7c2d12', lineHeight: 1.6, flex: 1, margin: 0, fontWeight: 500 }}>
                <strong>{t('policyGapIdentified')}</strong> {t('literacy_insight_prefix')} <span style={{textTransform: 'capitalize'}}>{selectedDistrictName}</span> {t('literacy_insight_suffix')} {selectedData?.literacy_rate.toFixed(1)}{t('literacy_insight_end')}
                {' '}{gap > 0 ? t('below_national').replace('{{gap}}', Math.abs(gap).toFixed(1)) : t('above_national').replace('{{gap}}', Math.abs(gap).toFixed(1))}
                <br/><br/>
                <strong>{t('recommendation')}</strong> {gap > 0 ? t('prioritizeSarvaShiksha') : t('focusInfrastructure')}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', fontSize: '1rem', fontWeight: 700, marginTop: '20px' }}>
                <BrainCircuit size={18} /> {t('generatedByBPIS')}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8', border: '2px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{t('noDistrictSelected')}</h3>
          <p>{t('pleaseSelectDistrict')}</p>
        </div>
      )}
    </div>
  );
};

export default DistrictCompare;

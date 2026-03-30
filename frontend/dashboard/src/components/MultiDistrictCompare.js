import { useEffect, useMemo, useState } from "react";
import { BarChart3, Columns3, TrendingDown, TrendingUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getPriorityRanking } from "../services/api";
import { getLocalizedDistrictName } from "../utils/districtLocalization";

const metricMeta = [
  { key: "literacy_rate", label: "Literacy", format: (value) => `${Number(value).toFixed(1)}%`, color: "#0ea5e9" },
  { key: "priority_score", label: "Priority Score", format: (value) => Number(value).toFixed(2), color: "#ea580c" },
  { key: "literacy_index", label: "Literacy Index", format: (value) => Number(value).toFixed(2), color: "#16a34a" },
  { key: "population", label: "Population", format: (value) => Number(value).toLocaleString("en-IN"), color: "#7c3aed" },
  { key: "gender_ratio", label: "Gender Ratio", format: (value) => Number(value).toFixed(0), color: "#0f172a" },
];

function DistrictSlot({ value, onChange, placeholder }) {
  return (
    <input
      list="district-compare-options"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        padding: "12px 14px",
        background: "white",
        color: "#0f172a",
        fontSize: "0.98rem",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

export default function MultiDistrictCompare() {
  const { t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selected, setSelected] = useState(["", "", ""]);

  useEffect(() => {
    getPriorityRanking().then((data) => {
      setDistricts(data || []);
    });
  }, []);

  const resolved = useMemo(() => {
    return selected
      .filter(Boolean)
      .map((name) => districts.find((district) => district.district?.toLowerCase() === name.toLowerCase()))
      .filter(Boolean);
  }, [selected, districts]);

  const metricRows = metricMeta.map((metric) => {
    const values = resolved.map((district) => Number(district?.[metric.key] || 0));
    const max = Math.max(...values, 1);
    return {
      ...metric,
      values,
      max,
    };
  });

  const spread = (metricKey) => {
    const values = resolved.map((district) => Number(district?.[metricKey] || 0));
    if (!values.length) return 0;
    return Math.max(...values) - Math.min(...values);
  };

  if (!districts.length) {
    return null;
  }

  return (
    <div className="gov-card" style={{ background: "white", marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h2 className="gov-heading" style={{ margin: 0 }}>
            {t("districtCompareTitle") || "Side-by-side comparison"}
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
            Compare up to three districts across literacy, population pressure, priority score, and demographic signals.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ea580c", fontWeight: 700 }}>
          <Columns3 size={18} />
          Deep comparison
        </div>
      </div>

      <datalist id="district-compare-options">
        {districts.map((district) => (
          <option key={district.district} value={district.district}>
            {getLocalizedDistrictName(t, district.district)}
          </option>
        ))}
      </datalist>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px", marginBottom: "22px" }}>
        {selected.map((value, index) => (
          <DistrictSlot
            key={`compare-slot-${index}`}
            value={value}
            onChange={(nextValue) => {
              setSelected((current) => current.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
            }}
            placeholder={`District ${index + 1}`}
          />
        ))}
      </div>

      {resolved.length ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${resolved.length}, minmax(0, 1fr))`, gap: "16px", marginBottom: "20px" }}>
            {resolved.map((district) => (
              <div key={district.district} style={{ borderRadius: "18px", border: "1px solid #e2e8f0", padding: "18px", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
                <div style={{ color: "#ea580c", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                  {getLocalizedDistrictName(t, district.district)}
                </div>
                <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
                  {Number(district.priority_score || 0).toFixed(2)}
                </div>
                <div style={{ color: "#64748b", marginTop: "6px" }}>
                  Priority score
                </div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                  <th style={{ padding: "14px", borderBottom: "1px solid #e2e8f0" }}>Metric</th>
                  {resolved.map((district) => (
                    <th key={district.district} style={{ padding: "14px", borderBottom: "1px solid #e2e8f0" }}>
                      {getLocalizedDistrictName(t, district.district)}
                    </th>
                  ))}
                  <th style={{ padding: "14px", borderBottom: "1px solid #e2e8f0" }}>Spread</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((metric) => (
                  <tr key={metric.key}>
                    <td style={{ padding: "14px", borderBottom: "1px solid #eef2f7", fontWeight: 700, color: "#0f172a" }}>
                      {metric.label}
                    </td>
                    {metric.values.map((value, valueIndex) => (
                      <td key={`${metric.key}-${valueIndex}`} style={{ padding: "14px", borderBottom: "1px solid #eef2f7" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ minWidth: "110px", fontWeight: 700, color: "#0f172a" }}>{metric.format(value)}</div>
                          <div style={{ flex: 1, height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ width: `${(value / metric.max) * 100}%`, height: "100%", background: metric.color, borderRadius: "999px" }} />
                          </div>
                        </div>
                      </td>
                    ))}
                    <td style={{ padding: "14px", borderBottom: "1px solid #eef2f7", color: "#475569", fontWeight: 700 }}>
                      {metric.key === "population" ? Number(spread(metric.key)).toLocaleString("en-IN") : metric.key === "gender_ratio" ? Number(spread(metric.key)).toFixed(0) : Number(spread(metric.key)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px", marginTop: "18px" }}>
            {resolved.map((district) => (
              <div key={`summary-${district.district}`} style={{ borderRadius: "18px", background: "#0f172a", color: "white", padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f97316", fontWeight: 800, marginBottom: "8px" }}>
                  <BarChart3 size={18} />
                  {getLocalizedDistrictName(t, district.district)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <TrendingUp size={16} />
                  Literacy: {Number(district.literacy_rate || 0).toFixed(1)}%
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <TrendingDown size={16} />
                  Population: {Number(district.population || 0).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: "28px", borderRadius: "18px", border: "1px dashed #cbd5e1", color: "#64748b" }}>
          Select at least one district to start comparing.
        </div>
      )}
    </div>
  );
}

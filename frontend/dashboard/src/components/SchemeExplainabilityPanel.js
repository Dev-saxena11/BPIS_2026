import { useEffect, useState } from "react";
import { BrainCircuit, Lightbulb, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getPriorityRanking, getSchemeRecommendation } from "../services/api";
import { getLocalizedDistrictName } from "../utils/districtLocalization";

export default function SchemeExplainabilityPanel() {
  const { t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    getPriorityRanking().then((data) => {
      setDistricts(data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedDistrict) return;
    getSchemeRecommendation(selectedDistrict).then(setResult);
  }, [selectedDistrict]);

  return (
    <div className="gov-card" style={{ background: "white", marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h2 className="gov-heading" style={{ margin: 0 }}>
            Recommendation explainability
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
            See exactly which district signals triggered each scheme recommendation.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ea580c", fontWeight: 700 }}>
          <Sparkles size={18} />
          Rule trace
        </div>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>District</label>
        <input
          list="scheme-explain-options"
          value={selectedDistrict}
          onChange={(event) => setSelectedDistrict(event.target.value)}
          placeholder="Select a district"
          style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box" }}
        />
        <datalist id="scheme-explain-options">
          {districts.map((district) => (
            <option key={district.district} value={district.district}>
              {getLocalizedDistrictName(t, district.district)}
            </option>
          ))}
        </datalist>
      </div>

      {result ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "16px" }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "18px", padding: "18px", background: "#f8fafc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#ea580c", fontWeight: 800 }}>
              <BrainCircuit size={18} />
              District snapshot
            </div>
            <div style={{ display: "grid", gap: "10px", color: "#334155" }}>
              <div><strong>District:</strong> {getLocalizedDistrictName(t, result.district)}</div>
              <div><strong>State:</strong> {result.district_snapshot?.state || "N/A"}</div>
              <div><strong>Literacy:</strong> {Number(result.district_snapshot?.literacy_rate || 0).toFixed(2)}%</div>
              <div><strong>Population:</strong> {Number(result.district_snapshot?.population || 0).toLocaleString("en-IN")}</div>
              <div><strong>Gender ratio:</strong> {Number(result.district_snapshot?.gender_ratio || 0).toFixed(0)}</div>
              <div><strong>Literacy index:</strong> {Number(result.district_snapshot?.literacy_index || 0).toFixed(2)}</div>
            </div>
          </div>

          <div style={{ border: "1px solid #e2e8f0", borderRadius: "18px", padding: "18px", background: "#fff7ed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#9a3412", fontWeight: 800 }}>
              <Lightbulb size={18} />
              Why these schemes were suggested
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {(result.issue_details || []).map((item) => (
                <div key={item.issue} style={{ background: "white", borderRadius: "14px", padding: "14px", border: "1px solid rgba(251, 146, 60, 0.3)" }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                    {item.issue.replaceAll("_", " ")}
                  </div>
                  <div style={{ color: "#475569", lineHeight: 1.7 }}>{item.reason}</div>
                </div>
              ))}
              {!result.issue_details?.length && (
                <div style={{ color: "#64748b" }}>No strong trigger rules fired for this district.</div>
              )}
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "18px", background: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#ea580c", fontWeight: 800 }}>
              <Sparkles size={18} />
              Recommended schemes
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {(result.recommended_schemes || []).map((scheme) => (
                <div key={scheme} style={{ borderRadius: "16px", border: "1px solid #e2e8f0", padding: "16px", background: "#f8fafc" }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{scheme}</div>
                  <div style={{ color: "#475569", lineHeight: 1.7 }}>
                    {(result.scheme_explanations?.[scheme] || []).join(" ")}
                  </div>
                </div>
              ))}
              {!result.recommended_schemes?.length && (
                <div style={{ color: "#64748b" }}>No scheme recommendation required.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: "16px", border: "1px dashed #cbd5e1", padding: "24px", color: "#64748b" }}>
          Loading explanation...
        </div>
      )}
    </div>
  );
}

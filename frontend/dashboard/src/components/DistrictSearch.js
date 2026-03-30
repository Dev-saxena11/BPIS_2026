import { useEffect, useRef, useState } from "react";

function DistrictSearch({ districts, onSelect, placeholder }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDistricts = (districts || []).filter((district) => {
    const label = district?.district || "";
    return label.toLowerCase().includes(query.toLowerCase());
  });

  const handleSelect = (districtName) => {
    setQuery(districtName);
    onSelect(districtName);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-block",
        top: "10px",
        margin: "5px",
        left: "0px",
        zIndex: 1000,
        background: "white",
        padding: "8px",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        minWidth: "320px",
      }}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          placeholder={placeholder || "Search District..."}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredDistricts.length > 0) {
              handleSelect(filteredDistricts[0].district);
            }
          }}
          style={{
            padding: "10px 12px",
            width: "100%",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "0.98rem",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          style={{
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#0f172a",
            color: "white",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isOpen ? "Hide" : "Districts"}
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: "8px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            maxHeight: "280px",
            overflowY: "auto",
            background: "white",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          }}
        >
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => (
              <button
                key={district.district}
                type="button"
                onClick={() => handleSelect(district.district)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "white",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                {district.district}
              </button>
            ))
          ) : (
            <div style={{ padding: "12px", color: "#64748b" }}>No matching districts found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DistrictSearch;

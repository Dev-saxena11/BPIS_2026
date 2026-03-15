import { useState } from "react";

function DistrictSearch({ districts, onSelect }) {

  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    const match = districts.find(d =>
      d.district.toLowerCase().includes(value.toLowerCase())
    );

    if (match) {
      onSelect(match.district);
    }
  };

  return (
  <div
    style={{
      position: "relative",
      display: "inline-block",
      top: "10px",
      margin: "5px",
      left: "0px",
      zIndex: 1000,
      background: "white",
      padding: "6px",
      borderRadius: "6px",
      boxShadow: "0 0 5px rgba(0,0,0,0.3)"
    }}
  >
    <input
      type="text"
      placeholder="Search District..."
      value={query}
      onChange={handleSearch}
      style={{
        padding: "6px",
        width: "220px",
        border: "1px solid #ccc",
        borderRadius: "4px"
      }}
    />
  </div>
);
}

export default DistrictSearch;
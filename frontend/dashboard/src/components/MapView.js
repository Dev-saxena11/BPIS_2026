import L from "leaflet";
import DistrictSearch from "./DistrictSearch";
import Legend from "./Legend";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

/* Controller used to zoom map when a district is selected */
function MapController({ selectedDistrict, geoData }) {

  const map = useMap();

  useEffect(() => {

    if (!selectedDistrict || !geoData) return;

    const feature = geoData.features.find(f =>
      f.properties?.district?.toLowerCase() === selectedDistrict.toLowerCase()
    );

    if (!feature) return;

    const layer = L.geoJSON(feature);

    const bounds = layer.getBounds();

    map.fitBounds(bounds);

  }, [selectedDistrict, geoData, map]);

  return null;
}

function MapView() {

  const [geoData, setGeoData] = useState(null);
  const [priorityData, setPriorityData] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showHighPriority, setShowHighPriority] = useState(false);

  /* Load GeoJSON */
  useEffect(() => {
    fetch("/maps/INDIA_DISTRICTS.geojson")
      .then(res => res.json())
      .then(data => {
        console.log("GeoJSON loaded:", data);
        setGeoData(data);
      });
  }, []);

  /* Load priority data */
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/priority-ranking")
      .then(res => {
        setPriorityData(res.data);
        setDistrictList(res.data);
      });
  }, []);

  /* Get priority score */
  const getPriorityScore = (districtName) => {

    if (!districtName) return 0;

    const match = priorityData.find(
      d => d.district?.toLowerCase() === districtName.toLowerCase()
    );

    return match ? match.priority_score : 0;
  };

  /* Style districts */
  const styleDistrict = (feature) => {

  const districtName = feature.properties?.district;
  const score = getPriorityScore(districtName);

  if (showHighPriority && score < 60) {
    return {
      fillOpacity: 0,
      opacity: 0
    };
  }

  let color = "#2ecc71";

  if (score > 80) color = "#e74c3c";
  else if (score > 60) color = "orange";

  return {
    fillColor: color,
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7
  };
};

  /* Tooltip + Popup logic */
  const onEachDistrict = (feature, layer) => {

    const name = feature.properties?.district;
    if (!name) return;

    layer.bindTooltip(name);

    const match = priorityData.find(
      d => d.district?.toLowerCase() === name.toLowerCase()
    );

    if (!match) return;

    layer.on("click", async () => {

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/scheme-recommendation/${match.district}`
        );

        const schemeData = await response.json();

        const issues = schemeData.issues || [];
        const schemes = schemeData.recommended_schemes || [];

        layer.bindPopup(`
          <div style="font-size:14px">
            <b>District:</b> ${match.district}<br/>
            <b>State:</b> ${match.state}<br/>
            <b>Population:</b> ${match.population?.toLocaleString()}<br/>
            <b>Literacy Rate:</b> ${match.literacy_rate?.toFixed(2)}%<br/>
            <b>Priority Score:</b> ${match.priority_score?.toFixed(2)}<br/><br/>

            <b>Issues Detected:</b><br/>
            ${issues.map(i => `• ${i}`).join("<br>")}<br/><br/>

            <b>Recommended Schemes:</b><br/>
            ${schemes.map(s => `• ${s}`).join("<br>")}
          </div>
        `).openPopup();

      } catch (error) {
        console.error("Scheme API error:", error);
      }

    });

  };

  return (

  <div style={{ position: "relative" }}>

    <DistrictSearch
      districts={districtList}
      onSelect={(name) => setSelectedDistrict(name)}
    />

    <div style={{ marginBottom: "10px", marginTop: "10px" }}>
      <button
        onClick={() => setShowHighPriority(!showHighPriority)}
        style={{
          padding: "8px 12px",
          background: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {showHighPriority ? "Show All Districts" : "Show Critical Districts"}
      </button>
    </div>

    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >

      <MapController
        selectedDistrict={selectedDistrict}
        geoData={geoData}
      />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData && (
        <GeoJSON
          data={geoData}
          style={styleDistrict}
          onEachFeature={onEachDistrict}
        />
      )}

    </MapContainer>

    <Legend />

  </div>

);
}

export default MapView;
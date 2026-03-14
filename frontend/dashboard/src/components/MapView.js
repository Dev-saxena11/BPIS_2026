import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";

function MapView() {

  const [geoData, setGeoData] = useState(null);
  const [priorityData, setPriorityData] = useState([]);

  // Load GeoJSON
  useEffect(() => {
  fetch("/maps/INDIA_DISTRICTS.geojson")
    .then(res => res.json())
    .then(data => {
      console.log("GeoJSON loaded:", data);
      setGeoData(data);
    });
}, []);

  // Load priority scores from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/priority-ranking")
      .then(res => setPriorityData(res.data));
  }, []);

  // Function to match district score
  const getPriorityScore = (districtName) => {

  if (!districtName) return 0;

  const match = priorityData.find(
    d =>d.district.toLowerCase() === districtName.toLowerCase()
  );

  return match ? match.priority_score : 0;
};

  // Style districts based on score
  const styleDistrict = (feature) => {
    console.log(feature.properties);
    const districtName =
    feature.properties.district;
    const score = getPriorityScore(districtName);

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

  // Tooltip
  const onEachDistrict = (feature, layer) => {

  const name = feature.properties?.district;
  if (!name) return;
  // Hover tooltip
  layer.bindTooltip(name);

  // Find district data from backend
  const match = priorityData.find(
    d =>d.district && d.district.toLowerCase() === name.toLowerCase()
  );

  if (match) {

    layer.on("click", () => {

      layer.bindPopup(`
        <div style="font-size:14px">
          <b>District:</b> ${match.district}<br/>
          <b>State:</b> ${match.state}<br/>
          <b>Population:</b> ${match.population?.toLocaleString()}<br/>
          <b>Literacy Rate:</b> ${match.literacy_rate?.toFixed(2)}%<br/>
          <b>Priority Score:</b> ${match.priority_score?.toFixed(2)}
        </div>
      `).openPopup();

    });

  }
};

  return (

    <MapContainer
      center={[22.9734, 78.6569]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >

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

  );
}

export default MapView;
import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
const AIPolicyAdvisor = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [increase, setIncrease] = useState(20); // default 20%
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/simulate/education?increase=${increase}`,
      );

      console.log("Simulation:", res.data); // debug
      setSimulation(res.data);
    } catch (err) {
      console.error("Simulation Error:", err);
    }
  };
  const handleAsk = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/ai-policy-advisor`, {
        query: query,
      });
      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err);
    }
    setLoading(false);
  };

  // add Before (AI Advisor) vs After (Simulation) comparison chart
  const chartData = (() => {
    if (!result?.supporting_data || !simulation?.data) return [];

    const before = result.supporting_data;

    const afterMap = {};
    simulation.data.forEach((d) => {
      afterMap[d.district] = d.priority_score;
    });

    return before.map((b) => ({
      district: b.district,
      before: Math.round(b.priority_score),
      after: Math.round(afterMap[b.district] ?? b.priority_score),
    }));
  })();

  console.log("result:", result);
  console.log("simulation:", simulation);
  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Policy Advisor</h2>
      {/* 🔍 Query Input */}
      <input
        type="text"
        placeholder="Ask policy question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "60%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleAsk}>Ask</button>
      <div style={{ marginTop: "10px" }}>
        <label>Increase Funding (%): </label>
        <input
          type="number"
          value={increase}
          onChange={(e) => setIncrease(e.target.value)}
          style={{ width: "80px", marginLeft: "10px" }}
        />
      </div>
      <button
        onClick={handleSimulate}
        disabled={!result}
        style={{ marginLeft: "10px" }}
      >
        Run Simulation
      </button>
      {chartData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Before vs After Policy Impact</h3>

          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="district" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="before" name="Before" fill="#8884d8" />
            <Bar dataKey="after" name="After" fill="#82ca9d" />
          </BarChart>
        </div>
      )}
      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}
      {/* 📊 Result */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          {/* 🟦 Districts */}
          <h3>Recommended Districts</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <h4>Before Simulation (Current High Priority)</h4>
            {result.recommended_districts.map((d, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  background: i === 0 ? "#ffcccc" : "#e0e0e0",
                  borderRadius: "5px",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 🧠 Reason */}
          <h3>Reason</h3>
          <p>{result.reason}</p>

          {/* 📋 Supporting Data */}
          <h3>Supporting Data</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>District</th>
                <th>Literacy</th>
                <th>Population</th>
                <th>Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {result.supporting_data.map((d, i) => (
                <tr key={i}>
                  <td>{d.district}</td>
                  <td>{d.literacy}</td>
                  <td>{d.population}</td>
                  <td>{d.priority_score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ⚡ Action */}
          <h3>Recommended Action</h3>
          <p>{result.action}</p>
          <h3>Recommended Schemes (District-wise)</h3>

          {result.recommended_schemes &&
            result.recommended_schemes.map((d, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#f9f9f9",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>
                  {d.district}
                </strong>

                <ul style={{ marginTop: "5px" }}>
                  {d.schemes.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
      {/* Locate your BarChart and update the Bars */}
      {simulation && (
        <div style={{ marginTop: "30px", background: "#fff", padding: "20px" }}>
          <h3>Impact Analysis: Priority Score Reduction</h3>
            <BarChart width={600} height={300} data={simulation.chart_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="district" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Visualizing the difference */}
            <Bar
              name="Current Priority"
              dataKey="before_score"
              fill="#94a3b8"
            />
            <Bar
              name="Post-Intervention"
              dataKey="after_score"
              fill="#22c55e"
            />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default AIPolicyAdvisor;

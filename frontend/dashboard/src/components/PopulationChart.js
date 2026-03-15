import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

function PopulationChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/districts")
      .then(res => {

        const topPopulation = res.data
          .sort((a,b) => b.population - a.population)
          .slice(0,10);

        setData(topPopulation);

      });

  }, []);

  return (

    <div style={{ width:"100%", height:400,marginBottom:"40px" }}>

      <h3>Top Population Districts</h3>

      <ResponsiveContainer>

        <BarChart data={data}>

          <XAxis dataKey="district" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="population" fill="#3498db" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default PopulationChart;

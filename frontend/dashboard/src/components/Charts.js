// import TopDistricts from "./TopDistricts";

// function Charts(){

//   return(

//     <div>

//       <h3>Analytics Dashboard</h3>

//       <TopDistricts/>

//     </div>

//   );

// }

// export default Charts;
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

function Charts() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/priority-ranking")
      .then(res => {

        // take top 10 districts
        const top = res.data
          .sort((a,b) => b.priority_score - a.priority_score)
          .slice(0,10);

        setData(top);

      });
  }, []);

  return (

    <div style={{ width:"100%", height:400 }}>

      <h3>Top Priority Districts</h3>

      <ResponsiveContainer>

        <BarChart data={data}>

          <XAxis 
          dataKey="district"
          />
          <YAxis
          dataKey="priority_score" 
          />
          <Tooltip />

          <Bar dataKey="priority_score" fill="#e74c3c" />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default Charts;

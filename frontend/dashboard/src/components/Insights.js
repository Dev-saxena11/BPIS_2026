import { useEffect, useState } from "react";
import axios from "axios";

function Insights() {

  const [stats, setStats] = useState({
    lowLiteracy: 0,
    highRisk: "",
    avgLiteracy: 0
  });

  useEffect(() => {

    axios.get("http://localhost:8000/districts")
      .then(res => {

        const districts = res.data;

        const lowLiteracy = districts.filter(
          d => d.literacy_rate < 70
        ).length;

        const avgLiteracy =
          districts.reduce((sum,d) => sum + d.literacy_rate,0) /
          districts.length;

        setStats({
          lowLiteracy: lowLiteracy,
          avgLiteracy: avgLiteracy.toFixed(2)
        });

      });

    axios.get("http://localhost:8000/priority-ranking")
      .then(res => {

        const highestRisk =
          res.data.sort((a,b)=>b.priority_score-a.priority_score)[0];

        setStats(prev => ({
          ...prev,
          highRisk: highestRisk.district
        }));

      });

  }, []);

  return (

    <div>

      {/* <h3>Policy Insights</h3> */}

      <ul>

        <li>
          {stats.lowLiteracy} districts have literacy rate below 70%
        </li>

        <li>
          Highest risk district: <b>{stats.highRisk}</b>
        </li>

        <li>
          Average literacy rate: {stats.avgLiteracy}%
        </li>

      </ul>

    </div>

  );

}

export default Insights;

import React, { useEffect, useState } from "react";

function TopDistricts() {

  const [districts, setDistricts] = useState([]);

  useEffect(() => {

    fetch("http://localhost:8000/priority-ranking")
      .then(res => res.json())
      .then(data => {

        const top10 = data
          .sort((a, b) => b.priority_score - a.priority_score)
          .slice(0, 10);

        setDistricts(top10);
      });

  }, []);

  return (

    <div style={{marginTop: "10px"}}>

      <h4>Top Priority Districts</h4>

      <ol>
        {districts.map((d, index) => (

          <li key={index}>
            {d.district} ({d.state})
          </li>

        ))}
      </ol>

    </div>

  );
}

export default TopDistricts;
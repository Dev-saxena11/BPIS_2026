import { useEffect, useState } from "react";
import { getPriorityRanking } from "../services/api";

function PriorityTable() {

  const [districts, setDistricts] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const data = await getPriorityRanking();
      setDistricts(data);
    };

    fetchData();

  }, []);

  return (

    <div style={{ background:"white",padding:"20px",borderRadius:"8px",marginTop:"20px",boxShadow:"0 2px 6px rgba(0,0,0,0.08)" }}>
      <h3 style={{ marginTop: "40px" }}>Top Priority Districts</h3>

      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>

        <thead style={{textAlign:"left",background:"#f8fafc",padding:"10px",borderBottom:"2px solid #e5e7eb"}}>
          <tr>
            <th>District</th>
            <th>State</th>
            <th>Priority Score</th>
          </tr>
        </thead>

        <tbody style={{padding:"10px",borderBottom:"1px solid #e5e7eb"}}>
          {districts.slice(0,10).map((d,index) => (

            <tr key={index}>
              <td>{d.district}</td>
              <td>{d.state}</td>
              <td>{d.priority_score.toFixed(2)}</td>
            </tr>

          ))}
        </tbody>

      </table>

    </div>

  );
}

export default PriorityTable;
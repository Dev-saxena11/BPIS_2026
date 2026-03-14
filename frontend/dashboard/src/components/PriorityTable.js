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

    <div>
      <h3>Top Priority Districts</h3>

      <table border="1" cellPadding="5">

        <thead>
          <tr>
            <th>District</th>
            <th>State</th>
            <th>Priority Score</th>
          </tr>
        </thead>

        <tbody>
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
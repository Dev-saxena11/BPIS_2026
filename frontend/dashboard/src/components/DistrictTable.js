import { useEffect, useState } from "react";
import { getDistricts } from "../services/api";

function DistrictTable() {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDistricts();
      setDistricts(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h3>District Data</h3>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>District</th>
            <th>State</th>
            <th>Population</th>
            <th>Literacy Rate</th>
          </tr>
        </thead>

        <tbody>
          {districts.slice(0, 10).map((d, index) => (
            <tr key={index}>
              <td>{d.district}</td>
              <td>{d.state}</td>
              <td>{d.population}</td>
              <td>{d.literacy_rate.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DistrictTable;
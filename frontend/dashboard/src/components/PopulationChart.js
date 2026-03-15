import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

function PopulationChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/priority-ranking")
      .then(res => res.json())
      .then(result => {

        const top = result
          .sort((a,b) => b.population - a.population)
          .slice(0,5);

        setData(top);

      });

  }, []);

  const chartData = {
    labels: data.map(d => d.district),
    datasets: [
      {
        label: "Population",
        data: data.map(d => d.population),
        backgroundColor: "orange"
      }
    ]
  };

  return(
    <div>
      <h4>Top Population Districts</h4>
      <Bar
      id="populationChart"
      data={chartData}
      />
    </div>
  );
}

export default PopulationChart;
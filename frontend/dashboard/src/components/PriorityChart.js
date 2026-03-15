import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

function PriorityChart(){

  const [data,setData] = useState([]);

  useEffect(()=>{

    fetch("http://127.0.0.1:8000/priority-ranking")
      .then(res => res.json())
      .then(result => {

        const top = result
          .sort((a,b)=> b.priority_score - a.priority_score)
          .slice(0,5);

        setData(top);

      });

  },[]);

  const chartData = {

    labels: data.map(d => d.district),

    datasets:[
      {
        label:"Priority Score",
        data: data.map(d => d.priority_score),
        backgroundColor:"red"
      }
    ]
  };

  return(
    <div>
      <h4>Highest Priority Districts</h4>
      <Bar
      id="priorityChart"
      data={chartData}
      />
    </div>
  );
}

export default PriorityChart;
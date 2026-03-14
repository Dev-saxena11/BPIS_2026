import MapView from "../components/MapView";
import DistrictTable from "../components/DistrictTable";
import Charts from "../components/Charts";
import PriorityTable from "../components/PriorityTable";
function Dashboard() {
  return (
    <div style={{padding:"20px"}}>

      <h2>Policy Dashboard</h2>

      <MapView/>

      <br/>

      <Charts/>

      <br/>

      <DistrictTable/>
      <br/>
      <PriorityTable/>

    </div>
  );
}

export default Dashboard;
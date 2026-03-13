import MapView from "../components/MapView";
import DistrictTable from "../components/DistrictTable";
import Charts from "../components/Charts";

function Dashboard() {
  return (
    <div style={{padding:"20px"}}>

      <h2>Policy Dashboard</h2>

      <MapView/>

      <br/>

      <Charts/>

      <br/>

      <DistrictTable/>

    </div>
  );
}

export default Dashboard;
import "./gharList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import GharTable from "../ghartable/GharTable";

const GharList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <GharTable />
      </div>
    </div>
  );
};

export default GharList;

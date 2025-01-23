import "./newsList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import NewsTable from "../newstable/NewsTable";

const NewsList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <NewsTable />
      </div>
    </div>
  );
};

export default NewsList;

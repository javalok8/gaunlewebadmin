import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAdminType } from "../../../reduxtool/userSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  const [countUser, setCountUser] = useState(0);
  const [countNews, setCountNews] = useState(0); // Initialize countNews;
  const [countGhar, setCountGhar] = useState(0); // Initialize countGhar;
  const [adminTypes, setAdminTypes] = useState(""); // Initialize andminType;
  const [products, setProducts] = useState(0);
  const [trecking, setTrecking] = useState(0);
  const [videos, setVideos] = useState(0);

  dispatch(setAdminType(adminTypes));

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    const fetchCounts = async () => {
      const response = await axios.get(
        BASE_URL + `/api/users/countAllUser/${userId}`
      );

      if (response.data) {
        setCountUser(response.data.countUser);
        setCountNews(response.data.countNews);
        setCountGhar(response.data.countGhar);
        setAdminTypes(response.data.adminType);
      }
    };
    fetchCounts();
  }, [userId, navigate]);
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" countValue={countUser} linkRoute="/users" />
          <Widget type="news" countValue={countNews} linkRoute="/news" />
          <Widget type="ghar" countValue={countGhar} linkRoute="/ghar" />
          <Widget
            type="product"
            countValue={products}
            linkRoute={"/products"}
          />
          <Widget
            type="trecking"
            countValue={trecking}
            linkRoute={"/trecking"}
          />
          <Widget type="videos" countValue={videos} linkRoute={"/videos"} />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;

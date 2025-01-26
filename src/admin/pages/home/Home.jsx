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

const Home = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  let countUser;
  let countNews;
  let countGhar;
  let andminType;

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
        countUser = response.data.countUser;
        countNews = response.data.countNews;
        countGhar = response.data.countGhar;
        andminType = response.data.adminType;
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
          <Widget type="user" countValue={countUser} />
          <Widget type="news" countValue={countNews} />
          <Widget type="ghar" countValue={countGhar} />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
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

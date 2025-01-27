import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useNavigate } from "react-router-dom";

const Widget = ({ type, countValue, linkRoute }) => {
  const navigate = useNavigate();
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "See all Users",
      };
      break;
    case "news":
      data = {
        title: "NEWS",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "See all News",
        // icon: (
        //   <PersonOutlinedIcon
        //     className="icon"
        //     style={{
        //       color: "crimson",
        //       backgroundColor: "rgba(255, 0, 0, 0.2)",
        //     }}
        //   />
        // ),
      };
      break;
    case "ghar":
      data = {
        title: "HOME STAY",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "See all Homestay",
      };
      break;
    case "product":
      data = {
        title: "PRODUCTS",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "View all products",
        // icon: (
        //   <ShoppingCartOutlinedIcon
        //     className="icon"
        //     style={{
        //       backgroundColor: "rgba(218, 165, 32, 0.2)",
        //       color: "goldenrod",
        //     }}
        //   />
        // ),
      };
      break;
    case "trecking":
      data = {
        title: "TRECKING",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "View all Trecking",
      };
      break;
    case "videos":
      data = {
        title: "VIDEOS",
        countValue: countValue,
        linkRoute: linkRoute,
        link: "View all Videos",
      };
      // case "balance":
      //   data = {
      //     title: "BALANCE",
      //     isMoney: true,
      //     countValue: countValue,
      //     link: "See details",
      //     icon: (
      //       <AccountBalanceWalletOutlinedIcon
      //         className="icon"
      //         style={{
      //           backgroundColor: "rgba(128, 0, 128, 0.2)",
      //           color: "purple",
      //         }}
      //       />
      //     ),
      //   };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.countValue}
        </span>
        <span className="link" onClick={() => navigate(data.linkRoute)}>
          {data.link}
        </span>
      </div>
      {/* <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff}%
        </div>
        {data.icon}
      </div> */}
    </div>
  );
};

export default Widget;

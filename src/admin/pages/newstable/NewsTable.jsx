import "./newsTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NewsTable = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // Fetch all news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(BASE_URL + "/api/news/findAllNews");

        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this NEWS?"
    );
    if (!confirmDelete) {
      return; // Exit if the user cancels
    }
    try {
      const response = await axios.delete(
        BASE_URL + `/api/news/deleteNews/${id}`
      );
      if (response.status === 200) {
        alert("News deleted successfully");
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = (newsData) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this NEWS?"
    );
    if (!confirmUpdate) {
      return; // Exit if the user cancels
    }
    navigate("/news/newsNew", { state: { news: newsData } }); // Pass user data to NewUser
  };

  const newsListColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "newsImage",
      headerName: "Images",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={`${BASE_URL}${params.row.newsImage}`}
              alt="avatar"
            />
            {/* {params.row.newsTitle} */}
          </div>
        );
      },
    },
    {
      field: "newsCategory",
      headerName: "Category",
      width: 140,
    },
    {
      field: "newsTitle",
      headerName: "Title",
      width: 200,
    },
    {
      field: "newsDescription",
      headerName: "Description",
      width: 300,
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/news/newsNew" style={{ textDecoration: "none" }}>
              <div className="viewButton">Add</div>
            </Link>
            <div
              className="viewButton"
              onClick={() => handleUpdate(params.row)} // Pass row data
            >
              Update
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        List Of News
        <Link to="/news/newsNew" className="link">
          Add News
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={newsListColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default NewsTable;

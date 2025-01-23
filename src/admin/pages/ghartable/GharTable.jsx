import "./gharTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GharTable = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // Fetch all Ghar
  useEffect(() => {
    const fetchGhar = async () => {
      try {
        const res = await axios.get(BASE_URL + "/api/ghar/findAllGhar");

        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGhar();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Ghar?"
    );
    if (!confirmDelete) {
      return; // Exit if the Ghar cancels
    }
    try {
      const response = await axios.delete(
        BASE_URL + `/api/ghar/deleteGhar/${id}`
      );
      if (response.status === 200) {
        alert("Ghar deleted successfully");
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = (gharData) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this USER?"
    );
    if (!confirmUpdate) {
      return; // Exit if the Ghar cancels
    }
    navigate("/ghar/newGhar", { state: { ghar: gharData } }); // Pass user data to NewGhar
  };

  const gharListColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "villageImage",
      headerName: "Ghar",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={`${BASE_URL}${params.row.villageImage}`}
              alt="avatar"
            />
            {params.row.villageName}
          </div>
        );
      },
    },
    {
      field: "clubName",
      headerName: "Club Name",
      width: 250,
    },
    {
      field: "district",
      headerName: "District",
      width: 100,
    },
    {
      field: "palika",
      headerName: "UM/RM",
      width: 200,
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/ghar/newGhar" style={{ textDecoration: "none" }}>
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
        List Of Homes
        <Link to="/ghar/newGhar" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={gharListColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default GharTable;

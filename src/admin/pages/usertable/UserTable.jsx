import "./userTable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { userListColumns, userListRows } from "../../../dataTableSource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(BASE_URL + "/api/users/findAllAdminUser");

        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) {
      return; // Exit if the user cancels
    }
    try {
      const response = await axios.delete(
        BASE_URL + `/api/users/deleteAdminUser/${id}`
      );
      if (response.status === 200) {
        alert("User deleted successfully");
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = (userData) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this user?"
    );
    if (!confirmUpdate) {
      return; // Exit if the user cancels
    }
    navigate("/users/newUser", { state: { user: userData } }); // Pass user data to NewUser
  };

  const userListColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "villageImage",
      headerName: "User",
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
            <Link to="/users/newUser" style={{ textDecoration: "none" }}>
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
        List Of Users
        <Link to="/users/newUser" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userListColumns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default UserTable;

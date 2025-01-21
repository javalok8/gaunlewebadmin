import "./userTable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { userListColumns, userListRows } from "../../../dataTableSource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
  const [data, setData] = useState([]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/findAllAdminUser"
        );

        alert(JSON.stringify(res.data));

        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    alert(" lokendra id to delete=====>" + id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/deleteAdminUser/${id}`
      );
      alert(response.data.message);

      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
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
              src={`http://localhost:5000${params.row.villageImage}`}
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
            <Link
              to={`/users/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
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

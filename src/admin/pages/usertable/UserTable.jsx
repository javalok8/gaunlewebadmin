import "./userTable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { userListColumns, userListRows } from "../../../dataTableSource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const UserTable = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);

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
    try {
      const response = await axios.delete(
        BASE_URL + `/api/users/deleteAdminUser/${id}`
      );
      if (response.status === 200) {
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = (userData) => {
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
            <IconButton color="primary" aria-label="add">
              <Link to="/users/newUser" style={{ textDecoration: "none" }}>
                <Add />
              </Link>
            </IconButton>
            <IconButton
              onClick={() => handleUpdate(params.row)}
              color="primary"
              aria-label="update"
            >
              <Edit />
            </IconButton>

            <IconButton
              onClick={() => {
                setSelectedUsers(params.row);
                setOpenDialog(true);
              }}
              color="error"
              aria-label="delete"
            >
              <Delete />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUsers(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUsers) {
      await handleDelete(selectedUsers._id);
      setOpenDialog(false);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <Typography variant="h5" gutterBottom>
          List Of Users
        </Typography>
        <Link to="/users/newUser">
          <Button variant="contained" color="primary">
            Add Users
          </Button>
        </Link>
      </div>
      <Grid container justifyContent="center">
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userListColumns.concat(actionColumn)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Users?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;

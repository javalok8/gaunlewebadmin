import "./gharTable.scss";
import { DataGrid } from "@mui/x-data-grid";
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
  Tooltip,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";

const GharTable = () => {
  let userId = useSelector((state) => state.user.userId);
  const adminType = useSelector((state) => state.user.adminType);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGhar, setSelectedGhar] = useState(null);

  if (adminType === "sAdmin") {
    userId = "1";
  }

  // Fetch all Ghar
  useEffect(() => {
    const fetchGhar = async () => {
      try {
        const res = await axios.get(
          BASE_URL + `/api/ghar/findAllGhar/${userId}`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGhar();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        BASE_URL + `/api/ghar/deleteGhar/${id}`
      );
      if (response.status === 200) {
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdate = (gharData) => {
    navigate("/ghar/newGhar", { state: { ghar: gharData } }); // Pass user data to NewGhar
  };
  const handleAddDetail = (_id) => {
    navigate("/ghar/gharDetail", { state: { id: _id } }); // Pass user data to NewGhar
  };

  const gharListColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "homeType",
      headerName: "Ghar",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={`${BASE_URL}${params.row.homeImages[0]}`}
              alt="avatar"
            />
            {params.row.homeType}
          </div>
        );
      },
    },
    {
      field: "homeName",
      headerName: "Home Name",
      width: 200,
    },
    {
      field: "homeEmail",
      headerName: "Email",
      width: 100,
    },
    {
      field: "homePhone",
      headerName: "Phone",
      width: 100,
    },
    {
      field: "homeAddress",
      headerName: "Address",
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
            <IconButton color="primary" aria-label="addButton">
              <Link to="/ghar/newGhar">
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
                setSelectedGhar(params.row);
                setOpenDialog(true);
              }}
              color="error"
              aria-label="delete"
            >
              <Delete />
            </IconButton>

            <Tooltip title="Add detail" placement="top">
              <IconButton
                onClick={() => handleAddDetail(params.row._id)}
                color="primary"
                aria-label="update"
              >
                <AddTaskIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedGhar(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedGhar) {
      await handleDelete(selectedGhar._id);
      setOpenDialog(false);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <Typography variant="h5" gutterBottom>
          List Of Ghar
        </Typography>
        <Link to="/ghar/newGhar">
          <Button variant="contained" color="primary">
            Add Home
          </Button>
        </Link>
      </div>
      <Grid container justifyContent="center">
        <DataGrid
          className="datagrid"
          rows={data}
          columns={gharListColumns.concat(actionColumn)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this Home?</Typography>
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
      </Grid>
    </div>
  );
};

export default GharTable;

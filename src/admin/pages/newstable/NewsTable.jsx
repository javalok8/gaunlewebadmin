import "./newsTable.scss";
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
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { useSelector } from "react-redux";

const NewsTable = () => {
  //global userId and adminType to controller access
  let userId = useSelector((state) => state.user.userId);
  const adminType = useSelector((state) => state.user.adminType);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  if (adminType === "sAdmin") {
    userId = "1";
  }

  // Fetch all news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          BASE_URL + `/api/news/findAllNews/${userId}`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        BASE_URL + `/api/news/deleteNews/${id}`
      );
      if (response.status === 200) {
        setData(data.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (newsData) => {
    navigate("/news/newsNew", { state: { news: newsData } });
  };

  const newsListColumns = [
    { field: "_id", headerName: "ID", width: 70 },
    {
      field: "newsImage",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={`${BASE_URL}${params.row.newsImage}`}
            alt="avatar"
          />
        </div>
      ),
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
      headerName: "Actions",
      width: 220,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <IconButton color="primary" aria-label="add">
              <Link to="/news/newsNew" style={{ textDecoration: "none" }}>
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
                setSelectedNews(params.row);
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
    setSelectedNews(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedNews) {
      await handleDelete(selectedNews._id);
      setOpenDialog(false);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <Typography variant="h5" gutterBottom>
          List Of News
        </Typography>
        <Link to="/news/newsNew">
          <Button variant="contained" color="primary">
            Add News
          </Button>
        </Link>
      </div>
      <Grid container justifyContent="center">
        <DataGrid
          className="datagrid"
          rows={data}
          columns={newsListColumns.concat(actionColumn)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Grid>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this News?</Typography>
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

export default NewsTable;

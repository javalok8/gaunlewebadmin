import "./serviceNew.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ServiceNew = ({ inputs, title, userId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { state } = useLocation();
  const id = state?.id || {};

  useEffect(() => {
    axios.get(BASE_URL + "/api/services/findAllServices").then((response) => {
      setServices(response.data);
    });
    axios.get(BASE_URL + "/api/rooms/findAllRooms").then((response) => {
      setRooms(response.data);
    });
    axios.get(BASE_URL + "/api/foods/findAllFoods").then((response) => {
      setFoods(response.data);
    });
  }, []);

  const [formServiceData, setFormServiceData] = useState({
    homeId: id,
    serviceName: "",
  });
  const [services, setServices] = useState([]);
  const [backEndServiceError, setBackEndServiceError] = useState("");

  // Handle form submission
  const handleServiceSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/services/addServices`,
        formServiceData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setBackEndServiceError(
          <font color="green">
            {response.status === 201
              ? "Success TO ADD DATA."
              : "Success TO ADD DATA."}
          </font>
        );
        // Fetch the updated list of services
        const updatedServices = await axios.get(
          `${BASE_URL}/api/services/findAllServices`
        );
        setServices(updatedServices.data); // Update the services state
        setFormServiceData({ ...formServiceData, serviceName: "" }); // Clear the input field
      } else {
        setBackEndServiceError(
          <font color="red">
            {response.status === 400
              ? "ALL THE FIELDS ARE REQUIRED."
              : "INVALID USER DATA."}
          </font>
        );
      }
    } catch (error) {
      setBackEndServiceError(
        <font color="red">
          Failed to submit data. There might be issues on the server.
        </font>
      );
    }
  };

  // Handle input change
  const handleServiceInputChange = (event) => {
    const { name, value } = event.target;
    setFormServiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle delete service
  const handleServiceDelete = (id) => {
    axios.delete(`${BASE_URL}/api/services/deleteServices/${id}`).then(() => {
      setServices(services.filter((service) => service._id !== id));
    });
  };

  const [formRoomsData, setFormRoomsData] = useState({
    homeId: id,
    roomType: "",
    roomNo: "",
    roomPrice: "",
  });
  const [rooms, setRooms] = useState([]);
  const [backEndRoomsError, setBackEndRoomsError] = useState("");

  // Handle form submission
  const handleRoomsSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/rooms/addRooms`,
        formRoomsData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setBackEndRoomsError(
          <font color="green">
            {response.status === 201
              ? "Success TO ADD DATA."
              : "Success TO ADD DATA."}
          </font>
        );
        // Fetch the updated list of Rooms
        const updatedRooms = await axios.get(
          `${BASE_URL}/api/rooms/findAllRooms`
        );
        setRooms(updatedRooms.data); // Update the Rooms state
        setFormRoomsData({
          ...formRoomsData,
          roomType: "",
          roomNo: "",
          roomPrice: "",
        }); // Clear the input field
      } else {
        setBackEndRoomsError(
          <font color="red">
            {response.status === 400
              ? "ALL THE FIELDS ARE REQUIRED."
              : "INVALID USER DATA."}
          </font>
        );
      }
    } catch (error) {
      setBackEndRoomsError(
        <font color="red">
          Failed to submit data. There might be issues on the server.
        </font>
      );
    }
  };

  // Handle input change
  const handleRoomsInputChange = (event) => {
    const { name, value } = event.target;
    setFormRoomsData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle delete Rooms
  const handleRoomsDelete = (id) => {
    axios.delete(`${BASE_URL}/api/rooms/deleteRooms/${id}`).then(() => {
      setRooms(rooms.filter((rooms) => rooms._id !== id));
    });
  };

  const [formFoodsData, setFormFoodsData] = useState({
    homeId: id,
    foodName: "",
    foodDetail: "",
    foodPrice: "",
  });

  const [foods, setFoods] = useState([]);
  const [backEndFoodsError, setBackEndFoodsError] = useState("");

  // Handle form submission
  const handleFoodsSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/foods/addFoods`,
        formFoodsData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setBackEndFoodsError(
          <font color="green">
            {response.status === 201
              ? "Success TO ADD DATA."
              : "Success TO ADD DATA."}
          </font>
        );
        // Fetch the updated list of Foods
        const updatedFoods = await axios.get(
          `${BASE_URL}/api/foods/findAllFoods`
        );
        setFoods(updatedFoods.data); // Update the Rooms state
        setFormFoodsData({
          ...formFoodsData,
          foodName: "",
          foodDetail: "",
          foodPrice: "",
        }); // Clear the input field
      } else {
        setBackEndFoodsError(
          <font color="red">
            {response.status === 400
              ? "ALL THE FIELDS ARE REQUIRED."
              : "INVALID USER DATA."}
          </font>
        );
      }
    } catch (error) {
      setBackEndFoodsError(
        <font color="red">
          Failed to submit data. There might be issues on the server.
        </font>
      );
    }
  };

  // Handle input change
  const handleFoodsInputChange = (event) => {
    const { name, value } = event.target;
    setFormFoodsData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle delete Foods
  const handleFoodsDelete = (id) => {
    axios.delete(`${BASE_URL}/api/foods/deleteFoods/${id}`).then(() => {
      setFoods(foods.filter((foods) => foods._id !== id));
    });
  };

  return (
    <div className="newNews">
      <Sidebar />
      <div className="newNewsContainer">
        <Navbar />
        <div className="top">
          <Typography variant="h10" gutterBottom>
            Add Services
          </Typography>
          <Link to="/ghar">
            <Button variant="contained" color="primary">
              Back To Home
            </Button>
          </Link>
        </div>
        <div className="bottom">
          <Grid
            container
            component="main"
            sx={{
              height: "100vh",
              flexWrap: "wrap",
              backgroundColor: "#1976d2",
            }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              container
              component="main"
              sx={{
                height: "100vh",
                flexWrap: "wrap",
                backgroundColor: "#1976d2",
              }}
              alignItems="center"
              justifyContent="center"
              spacing={2} // Adjusts the spacing between the items
            >
              <Grid
                item
                xs={4}
                sx={{
                  backgroundColor: "white",
                  height: "100%",
                  borderRadius: "20px",
                }}
              >
                Services
                <form
                  onSubmit={handleServiceSubmit}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <TextField
                    label="Service Name"
                    name="serviceName"
                    value={formServiceData.serviceName}
                    onChange={handleServiceInputChange}
                    required
                  />
                  <span className="error-message">{backEndServiceError}</span>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
                <Box
                  sx={{
                    maxHeight: "450px",
                    overflow: "auto",
                    marginTop: "10px",
                  }}
                >
                  <Table stickyHeader sx={{ marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell sx={{ width: "10%" }}>ID</TableCell> */}
                        <TableCell sx={{ width: "80%" }}>
                          Service Name
                        </TableCell>
                        <TableCell sx={{ width: "20%" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service._id}>
                          {/* <TableCell>{service._id}</TableCell> */}
                          <TableCell>{service.serviceName}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleServiceDelete(service._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  backgroundColor: "lightgray",
                  height: "100%",
                  borderRadius: "20px",
                }}
              >
                Rooms
                <form
                  onSubmit={handleRoomsSubmit}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <TextField
                    label="Room No"
                    name="roomNo"
                    type="number"
                    value={formRoomsData.roomNo}
                    onChange={handleRoomsInputChange}
                    required
                  />
                  <TextField
                    label="Room Type"
                    name="roomType"
                    value={formRoomsData.roomType}
                    onChange={handleRoomsInputChange}
                    required
                  />

                  <TextField
                    label="Room Price"
                    name="roomPrice"
                    type="number"
                    value={formRoomsData.roomPrice}
                    onChange={handleRoomsInputChange}
                    required
                  />
                  <span className="error-message">{backEndRoomsError}</span>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflow: "auto",
                    marginTop: "10px",
                  }}
                >
                  <Table stickyHeader sx={{ marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "20%" }}>No</TableCell>
                        <TableCell sx={{ width: "30%" }}>Type</TableCell>
                        <TableCell sx={{ width: "30%" }}>Price</TableCell>
                        <TableCell sx={{ width: "20%" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rooms.map((rooms) => (
                        <TableRow key={rooms._id}>
                          <TableCell>{rooms.roomNo}</TableCell>
                          <TableCell>{rooms.roomType}</TableCell>
                          <TableCell>{rooms.roomPrice}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleRoomsDelete(rooms._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  backgroundColor: "lightblue",
                  height: "100%",
                  borderRadius: "20px",
                }}
              >
                Foods
                <form
                  onSubmit={handleFoodsSubmit}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <TextField
                    label="Food Name"
                    name="foodName"
                    value={formFoodsData.foodName}
                    onChange={handleFoodsInputChange}
                    required
                  />
                  <TextField
                    label="Food Detail"
                    name="foodDetail"
                    value={formFoodsData.foodDetail}
                    onChange={handleFoodsInputChange}
                    rows={2}
                    required
                  />
                  <TextField
                    label="Food Price"
                    name="foodPrice"
                    type="number"
                    value={formFoodsData.foodPrice}
                    onChange={handleFoodsInputChange}
                    required
                  />
                  <span className="error-message">{backEndFoodsError}</span>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </form>
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflow: "auto",
                    marginTop: "10px",
                  }}
                >
                  <Table stickyHeader sx={{ marginTop: "20px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "10%" }}>Sn.No</TableCell>
                        <TableCell sx={{ width: "35%" }}>Name</TableCell>
                        <TableCell sx={{ width: "35%" }}>Price</TableCell>
                        <TableCell sx={{ width: "20%" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {foods.map((foods) => (
                        <TableRow key={foods._id}>
                          <TableCell>{foods.snNo}</TableCell>
                          <TableCell>{foods.foodName}</TableCell>
                          <TableCell>{foods.foodPrice}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleFoodsDelete(foods._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ServiceNew;

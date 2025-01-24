import "./newGhar.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import data from "../../../data/data";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {
  Button,
  TextField,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

const NewGhar = ({ inputs, title }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate(); // Initialize navigate

  const { state } = useLocation(); // Access state passed from navigate
  const userData = state?.user || {}; // Extract user data or use an empty object

  // populate formData with userData if editing
  const [formData, setFormData] = useState({
    district: userData.district || "",
    palika: userData.palika || "",
    wardNo: userData.wardNo || "",
    villageName: userData.villageName || "",
    clubName: userData.clubName || "",
    villageImage: userData.villageImage || "",
    clubIcon: userData.clubIcon || "",
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || "",
    password: userData.password || "",
    adminType: userData.adminType || "Admin",
    address: userData.address || "",
    editedDate: "",
  });

  const [villageImage, setVillageImage] = useState(userData.villageImage || "");
  const [clubIcon, setClubIcon] = useState(userData.clubIcon || "");

  useEffect(() => {
    if (userData.district) {
      // Populate palikas based on district
      const district = data.districts.find((d) => d.name === userData.district);
      setPalikas(district ? district.palikas : []);
    }
  }, [userData.district]);

  const [palikas, setPalikas] = useState([]);

  const [errors, setErrors] = useState({});
  const [backEndError, setBackEndError] = useState("");

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData({
      ...formData,
      district: districtName, // Update formData directly
      palika: "", // Clear palika when district changes
    });

    // Find palikas for the selected district
    const district = data.districts.find((d) => d.name === districtName);
    setPalikas(district ? district.palikas : []);
  };

  const handlePalikaChange = (e) => {
    const palikaName = e.target.value;
    setFormData({
      ...formData,
      palika: palikaName, // Update palika in formData directly
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.district) errors.district = "District is required.";
    if (!formData.palika) errors.palika = "UM/RM (Palika) is required.";
    if (!formData.villageName) errors.villageName = "Village name is required.";
    if (!/^[a-zA-Z\s]+$/.test(formData.villageName))
      errors.villageName = "Village name must be a string.";
    if (!formData.clubName) errors.clubName = "Club name is required.";
    if (!/^[a-zA-Z\s]+$/.test(formData.clubName))
      errors.clubName = "Club name must be a string.";
    if (!formData.wardNo) errors.wardNo = "Ward number is required.";
    if (!/^\d+$/.test(formData.wardNo))
      errors.wardNo = "Ward number must be a number.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Phone number must be 10 digits.";
    if (!formData.email) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email format is invalid.";
    if (!villageImage) errors.villageImage = "Village image is required.";
    if (!clubIcon) errors.clubIcon = "Village logo is required.";
    if (!formData.address) errors.address = "Address is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    console.log("==selected village image: " + e.target.files[0]);
    setVillageImage(e.target.files[0]);
  };
  const handleFileChangeLogo = (e) => {
    console.log("==selected club image: " + e.target.files[0]);
    setClubIcon(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare the form data for submission (add images if available)
    const formDataToSubmit = new FormData();

    formDataToSubmit.append("district", formData.district);
    formDataToSubmit.append("palika", formData.palika);
    formDataToSubmit.append("wardNo", formData.wardNo);
    formDataToSubmit.append("villageName", formData.villageName);
    formDataToSubmit.append("clubName", formData.clubName);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("phoneNumber", formData.phoneNumber);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("adminType", formData.adminType);
    formDataToSubmit.append("address", formData.address);

    // Append files (if available)
    if (villageImage) formDataToSubmit.append("villageImage", villageImage);
    if (clubIcon) formDataToSubmit.append("clubIcon", clubIcon);

    /**
     *
     * choosing URL whether to update or add user
     *
     */
    const MAIN_URL = userData._id
      ? `${BASE_URL}/api/users/updateAdminUser/${userData._id}`
      : `${BASE_URL}/api/users/registerAdminUser`;

    try {
      let response = "";
      if (userData._id) {
        response = await axios.put(MAIN_URL, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post(MAIN_URL, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 201) {
        setBackEndError(<font color="green">Success TO ADD DATA.</font>);
        navigate("/users");
      } else if (response.status === 200) {
        setBackEndError(<font color="green">Success TO UPDATE DATA.</font>);
        navigate("/users");
      } else if (response.status === 401) {
        //alert or show error message
        setBackEndError(<font color="red">USER ALREADY EXISTS.</font>);
      } else if (response.status === 400) {
        //alert or show error message
        setBackEndError(<font color="red">ALL THE FIELDS ARE REQUIRED.</font>);
      } else if (response.status === 402) {
        //alert or show error message
        setBackEndError(<font color="red">INVALID USER DATA.</font>);
      }
    } catch (error) {
      // alert("Failed to submit data there might be issues in Server.");
      setBackEndError(
        <font color="red">
          Failed to submit data there might be issues in Server.
        </font>
      );
    }
  };

  return (
    <div className="newUser">
      <Sidebar />
      <div className="newUserContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* <TextField
              label="Name"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Address"
              //value={address}
              // onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              accept="image/*"
              multiple
              type="file"
              // onChange={handleImageChange}
              id="image-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload">
              <IconButton
                color="primary"
                aria-label="upload pictures"
                component="span"
              >
                <DriveFolderUploadOutlinedIcon />
              </IconButton>
            </label>
            <TextField
              label="Name"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Address"
              //value={address}
              // onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              accept="image/*"
              multiple
              type="file"
              // onChange={handleImageChange}
              id="image-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="image-upload">
              <IconButton
                color="primary"
                aria-label="upload pictures"
                component="span"
              >
                <DriveFolderUploadOutlinedIcon />
              </IconButton>
            </label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //value={age}
              label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //value={age}
              label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //value={age}
              label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //value={age}
              label="Age"
              // onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select> */}
            <Autocomplete
              disablePortal
              //options={top100Films}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGhar;

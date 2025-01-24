import "./newUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import data from "../../../data/data";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const NewUser = ({ inputs, title }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { state } = useLocation();
  const userData = state?.user || {};

  const [formData, setFormData] = useState({
    district: userData.district || "Myagdi",
    palika: userData.palika || "Beni",
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
      const district = data.districts.find((d) => d.name === userData.district);
      setPalikas(district ? district.palikas : []);
    } else {
      const defaultDistrict = data.districts.find((d) => d.name === "Myagdi");
      setPalikas(defaultDistrict ? defaultDistrict.palikas : []);
    }
  }, [userData.district]);

  const [palikas, setPalikas] = useState([]);
  const [errors, setErrors] = useState({});
  const [backEndError, setBackEndError] = useState("");

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData({
      ...formData,
      district: districtName,
      palika: "",
    });

    const district = data.districts.find((d) => d.name === districtName);
    setPalikas(district ? district.palikas : []);
  };

  const handlePalikaChange = (e) => {
    const palikaName = e.target.value;
    setFormData({
      ...formData,
      palika: palikaName,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setVillageImage(e.target.files[0]);
  };

  const handleFileChangeLogo = (e) => {
    setClubIcon(e.target.files[0]);
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
    if (!clubIcon) errors.clubIcon = "Club logo is required.";

    if (!formData.address) errors.address = "Address is required.";

    // Password validation
    if (!formData.password) errors.password = "Password is required.";
    // Example: Password should be at least 8 characters long
    if (formData.password && formData.password.length < 8)
      errors.password = "Password must be at least 8 characters long.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

    if (villageImage) formDataToSubmit.append("villageImage", villageImage);
    if (clubIcon) formDataToSubmit.append("clubIcon", clubIcon);

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
        setBackEndError(<font color="red">USER ALREADY EXISTS.</font>);
      } else if (response.status === 400) {
        setBackEndError(<font color="red">ALL THE FIELDS ARE REQUIRED.</font>);
      } else if (response.status === 402) {
        setBackEndError(<font color="red">INVALID USER DATA.</font>);
      }
    } catch (error) {
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Village Image Upload */}
              <Grid item xs={6}>
                <div className="file-upload">
                  <input
                    accept="image/*"
                    id="villageImage"
                    type="file"
                    name="villageImage"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="villageImage">
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon />
                    </IconButton>
                    <Typography variant="body2">Upload Image</Typography>
                  </label>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                    src={
                      villageImage
                        ? villageImage instanceof File
                          ? URL.createObjectURL(villageImage) // If the image is selected from the computer
                          : `${BASE_URL}${villageImage}` // If it's an updated image URL
                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" // Default image if no image exists
                    }
                    alt="Village"
                  />
                </div>
                {errors.villageImage && (
                  <span className="error-message">{errors.villageImage}</span>
                )}
              </Grid>

              {/* Club Icon Upload */}
              <Grid item xs={6}>
                <div className="file-upload">
                  <input
                    accept="image/*"
                    id="clubIcon"
                    type="file"
                    name="clubIcon"
                    onChange={handleFileChangeLogo}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="clubIcon">
                    <IconButton color="primary" component="span">
                      <CloudUploadIcon />
                    </IconButton>
                    <Typography variant="body2">Upload Club Logo</Typography>
                  </label>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                    src={
                      clubIcon
                        ? clubIcon instanceof File
                          ? URL.createObjectURL(clubIcon) // If the image is selected from the computer
                          : `${BASE_URL}${clubIcon}` // If it's an updated image URL
                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" // Default image if no image exists
                    }
                    alt="Club"
                  />
                </div>
                {errors.clubIcon && (
                  <span className="error-message">{errors.clubIcon}</span>
                )}
              </Grid>
            </Grid>

            {/* Form fields */}
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth error={Boolean(errors.district)}>
                  <InputLabel>District</InputLabel>
                  <Select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                  >
                    {data.districts.map((district) => (
                      <MenuItem key={district.name} value={district.name}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.district && <span>{errors.district}</span>}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth error={Boolean(errors.palika)}>
                  <InputLabel>UM/RM</InputLabel>
                  <Select
                    name="palika"
                    value={formData.palika}
                    onChange={handlePalikaChange}
                  >
                    {palikas.map((palika) => (
                      <MenuItem key={palika.name} value={palika.name}>
                        {palika.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.palika && <span>{errors.palika}</span>}
                </FormControl>
              </Grid>

              {/* Ward No, Village Name, and Club Name fields */}
              <Grid item xs={6}>
                <TextField
                  name="wardNo"
                  label="Ward No"
                  type="number"
                  value={formData.wardNo}
                  onChange={handleInputChange}
                  error={Boolean(errors.wardNo)}
                  helperText={errors.wardNo}
                  // style={{
                  //   width: "300px", // Adjust the width
                  //   fontSize: "1.5rem", // Adjust the font size
                  // }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="villageName"
                  label="Village Name"
                  value={formData.villageName}
                  onChange={handleInputChange}
                  error={Boolean(errors.villageName)}
                  helperText={errors.villageName}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="clubName"
                  label="Club Name"
                  value={formData.clubName}
                  onChange={handleInputChange}
                  error={Boolean(errors.clubName)}
                  helperText={errors.clubName}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="phoneNumber"
                  label="Phone No"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  onChange={handleInputChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={Boolean(errors.address)}
                  helperText={errors.address}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="adminType"
                  label="Admin Type"
                  value={formData.adminType}
                  disabled
                />
              </Grid>
            </Grid>

            <span className="error-message">{backEndError}</span>
            <Button
              variant="contained"
              type="submit"
              style={{ float: "left", marginTop: "1rem" }}
            >
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;

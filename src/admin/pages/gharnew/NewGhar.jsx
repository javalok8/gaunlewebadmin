import "./newGhar.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { DriveFolderUploadOutlined as UploadIcon } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";

const NewGhar = ({ inputs, title }) => {
  const userIdRedux = useSelector((state) => state.user.userId);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate(); // Initialize navigate

  const { state } = useLocation(); // Access state passed from navigate
  const gharData = state?.ghar || {}; // Extract ghar data or use an empty object

  // populate formData with gharData if editing
  const [formData, setFormData] = useState({
    userId: gharData.userId || userIdRedux,
    homeName: gharData.homeName || "",
    homePriceLow: gharData.homePriceLow || "",
    homePriceHigh: gharData.homePriceHigh || "",
    homeAddress: gharData.homeAddress || "",
    homePhone: gharData.homePhone || "",
    homeEmail: gharData.homeEmail || "",
    homeDescription: gharData.homeDescription || "",
    homeStars: gharData.homeStars || 5,
    homeType: gharData.homeType || "", //home stay / Hotel /both
    homeImages: gharData.homeImages || [],
  });

  const [homeImages, setHomeImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [backEndError, setBackEndError] = useState("");

  const validateForm = () => {
    const errors = {};

    if (!formData.homeName) errors.homeName = "HomeStay is required.";
    if (!/^[a-zA-Z\s]+$/.test(formData.homeName))
      errors.homeName = "HomeStay name must be a string.";

    if (!formData.homePriceLow)
      errors.homePriceLow = "Lower Price is required.";

    if (!formData.homePriceHigh)
      errors.homePriceHigh = "Higher Price is required.";
    if (formData.homePriceLow > formData.homePriceHigh)
      errors.homePriceHigh = "Higher Price must be greater than Lower Price.";

    if (!formData.homeAddress) errors.homeAddress = "Address is required.";

    if (!formData.homePhone) errors.homePhone = "Phone number is required.";
    if (!/^\d{10}$/.test(formData.homePhone))
      errors.homePhone = "Phone number must be 10 digits.";

    if (!formData.homeEmail) errors.homeEmail = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.homeEmail))
      errors.homeEmail = "Email format is invalid.";

    if (!formData.homeDescription)
      errors.homeDescription = "HomeStay Description is required.";
    if (!/^[a-zA-Z\s]+$/.test(formData.homeDescription))
      errors.homeDescription = "HomeStay Description must be a string.";

    if (!formData.homeStars) errors.homeStars = "Stars is required.";
    if (!/^\d+$/.test(formData.homeStars))
      errors.homeStars = "Stars must be a number.";

    if (!formData.homeType)
      errors.homeType = "HomeStay/Hotel/Both is required.";

    if (homeImages.length === 0)
      errors.homeImages = "At least one image must be uploaded.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" is not a valid image.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5MB size limit.`);
        return false;
      }
      return true;
    });

    if (validImages.length > 0) {
      setFormData({ ...formData, homeImages: validImages });

      // Generate image previews
      const previews = validImages.map((file) => URL.createObjectURL(file));
      setHomeImages(previews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Prepare the form data for submission (add images if available)
    const formDataToSubmit = new FormData();

    formDataToSubmit.append("userId", formData.userId);
    formDataToSubmit.append("homeName", formData.homeName);
    formDataToSubmit.append("homePriceLow", formData.homePriceLow);
    formDataToSubmit.append("homePriceHigh", formData.homePriceHigh);
    formDataToSubmit.append("homeAddress", formData.homeAddress);
    formDataToSubmit.append("homePhone", formData.homePhone);
    formDataToSubmit.append("homeEmail", formData.homeEmail);
    formDataToSubmit.append("homeStars", formData.homeStars);
    formDataToSubmit.append("homeType", formData.homeType);
    formDataToSubmit.append("homeDescription", formData.homeDescription);
    formData.homeImages.forEach((file, index) =>
      formDataToSubmit.append("homeImages", file)
    );

    /**
     *
     * choosing URL whether to update or add homeStay
     *
     */
    const MAIN_URL = gharData._id
      ? `${BASE_URL}/api/ghar/updateGhar/${gharData._id}`
      : `${BASE_URL}/api/ghar/addGhar`;

    try {
      let response = "";
      if (gharData._id) {
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
        navigate("/ghar");
      } else if (response.status === 200) {
        setBackEndError(<font color="green">Success TO UPDATE DATA.</font>);
        navigate("/ghar");
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
              gap: "1rem",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                style={{ flex: 3 }}
                name="homeName"
                label="HomeStay Name"
                type="text"
                value={formData.homeName}
                onChange={handleChange}
                error={Boolean(errors.homeName)}
                helperText={errors.homeName}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                style={{ flex: 3 }}
                name="homeType"
                label="HomeStay Type"
                type="text"
                value={formData.homeType}
                onChange={handleChange}
                error={Boolean(errors.homeType)}
                helperText={errors.homeType}
                fullWidth
                margin="normal"
                required
              />
              {/* this label is only for occupy some spaces */}
              <label style={{ visibility: "hidden", flex: 6 }}></label>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                style={{ flex: 3 }}
                name="homePriceLow"
                label="Lowest Price"
                type="number"
                value={formData.homePriceLow}
                onChange={handleChange}
                error={Boolean(errors.homePriceLow)}
                helperText={errors.homePriceLow}
                fullWidth
                margin="normal"
                required
              />
              {/* Another TextField or empty space for 1/4 size */}
              <TextField
                style={{ flex: 3 }}
                name="homePriceHigh"
                label="Highest Price"
                type="number"
                value={formData.homePriceHigh}
                onChange={handleChange}
                error={Boolean(errors.homePriceHigh)}
                helperText={errors.homePriceHigh}
                fullWidth
                margin="normal"
                required
              />
              <label style={{ visibility: "hidden", flex: 6 }}></label>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                style={{ flex: 3 }}
                name="homeAddress"
                label="HomeStay Address"
                type="text"
                value={formData.homeAddress}
                onChange={handleChange}
                error={Boolean(errors.homeAddress)}
                helperText={errors.homeAddress}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                style={{ flex: 3 }}
                name="homeStars"
                label="HomeStay Stars"
                type="number"
                defaultValue={5}
                value={formData.homeStars}
                onChange={handleChange}
                error={Boolean(errors.homeStars)}
                helperText={errors.homeStars}
                fullWidth
                margin="normal"
                required
                disabled
              />
              {/* this label is only for occupy some spaces */}
              <label style={{ visibility: "hidden", flex: 6 }}></label>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                style={{ flex: 3 }}
                name="homeEmail"
                label="Email"
                value={formData.homeEmail}
                onChange={handleChange}
                error={Boolean(errors.homeEmail)}
                helperText={errors.homeEmail}
                fullWidth
                margin="normal"
                required
              />

              <TextField
                style={{ flex: 3 }}
                name="homePhone"
                label="Phone No"
                value={formData.homePhone}
                onChange={handleChange}
                error={Boolean(errors.homePhone)}
                helperText={errors.homePhone}
                type="number"
                fullWidth
                margin="normal"
                required
              />
              {/* this label is only for occupy some spaces */}
              <label style={{ visibility: "hidden", flex: 6 }}></label>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                style={{ flex: 6 }}
                name="homeDescription"
                label="HomeStay Description"
                value={formData.homeDescription}
                onChange={handleChange}
                multiline
                rows={4} // Number of rows for the text area
                fullWidth
                variant="outlined"
                error={Boolean(errors.homeDescription)}
                helperText={errors.homeDescription}
                margin="normal"
                required
              />
              {/* this label is only for occupy some spaces */}
              <label style={{ visibility: "hidden", flex: 6 }}></label>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                style={{ margin: "10px 0" }}
              >
                Upload Images
                <input
                  id="homeImages"
                  name="homeImages"
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            </div>
            {errors.homeImages && (
              <span className="error-message">{errors.homeImages}</span>
            )}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {homeImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </div>

            <span className="error-message">{backEndError}</span>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ borderRadius: "15px", width: "50%" }}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewGhar;

import "./newUser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import data from "../../../data/data";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const NewUser = ({ inputs, title }) => {
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
          <div className="left">
            <img
              src={
                villageImage
                  ? villageImage instanceof File
                    ? URL.createObjectURL(villageImage) // If the image is selected from the computer
                    : `${BASE_URL}${villageImage}` // If it's an updated image URL
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" // Default image if no image exists
              }
              alt=""
            />
            {/* <img
              src={
                villageImage
                  ? URL.createObjectURL(villageImage)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            /> */}
          </div>
          <div className="left-logo">
            <img
              src={
                clubIcon
                  ? clubIcon instanceof File
                    ? URL.createObjectURL(clubIcon) // If the image is selected from the computer
                    : `${BASE_URL}${clubIcon}` // If it's an updated image URL
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" // Default image if no image exists
              }
              alt=""
            />
            {/* <img
              src={
                clubIcon
                  ? URL.createObjectURL(clubIcon)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            /> */}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="formInput">
                <label htmlFor="file">
                  Village Image:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>

                <input
                  type="file"
                  id="file"
                  name="villageImage"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {errors.villageImage && (
                  <span className="error-message">{errors.villageImage}</span>
                )}
              </div>
              <div className="formInput">
                <label htmlFor="fileLogo">
                  Village Logo:{" "}
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="fileLogo"
                  name="clubIcon"
                  onChange={handleFileChangeLogo}
                  style={{ display: "none" }}
                />
                {errors.clubIcon && (
                  <span className="error-message">{errors.clubIcon}</span>
                )}
              </div>

              <div className="formInput">
                <label>District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                >
                  <option value="">-- District --</option>
                  {data.districts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <span className="error-message">{errors.district}</span>
                )}
              </div>
              <div className="formInput">
                <label>UM/RM</label>
                <select
                  name="palika"
                  value={formData.palika}
                  onChange={handlePalikaChange}
                >
                  <option value="">-- Palika --</option>
                  {palikas.map((palika) => (
                    <option key={palika.name} value={palika.name}>
                      {palika.name}
                    </option>
                  ))}
                </select>
                {errors.palika && (
                  <span className="error-message">{errors.palika}</span>
                )}
              </div>
              <div className="formInput">
                <label>Ward No.</label>
                <input
                  name="wardNo"
                  type="number"
                  placeholder="1"
                  value={formData.wardNo}
                  onChange={handleInputChange}
                />
                {errors.wardNo && (
                  <span className="error-message">{errors.wardNo}</span>
                )}
              </div>
              <div className="formInput">
                <label>Village Name</label>
                <input
                  name="villageName"
                  type="text"
                  placeholder="Narchyang"
                  value={formData.villageName}
                  onChange={handleInputChange}
                />
                {errors.villageName && (
                  <span className="error-message">{errors.villageName}</span>
                )}
              </div>
              <div className="formInput">
                <label>Club Name</label>
                <input
                  name="clubName"
                  type="text"
                  placeholder="Annapurna Youth Club"
                  value={formData.clubName}
                  onChange={handleInputChange}
                />
                {errors.clubName && (
                  <span className="error-message">{errors.clubName}</span>
                )}
              </div>
              <div className="formInput">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  placeholder="javalok2011@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div className="formInput">
                <label>Phone No</label>
                <input
                  name="phoneNumber"
                  type="number"
                  placeholder="+1 234 567 89"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <span className="error-message">{errors.phoneNumber}</span>
                )}
              </div>
              <div className="formInput">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder=""
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
              <div className="formInput">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Narchyang. 216 NewYork"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>
              <div className="formInput">
                <label>Admin Type</label>
                <input
                  name="adminType"
                  type="text"
                  placeholder="Admin"
                  disabled={true}
                />
              </div>
              <span className="error-message">{backEndError}</span>
              <button className="button" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;

import "./newsNew.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Input,
  FormHelperText,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const NewsNew = ({ inputs, title, userId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const { state } = useLocation();
  const newsData = state?.news || {};

  const [formData, setFormData] = useState({
    userId: newsData.userId || "679329221c6e1ae582f97eb0",
    newsTitle: newsData.newsTitle || "",
    newsCategory: newsData.newsCategory || "All", // Default value set to "All"
    newsDescription: newsData.newsDescription || "",
    newsImage: newsData.newsImage || "",
    richText: newsData.newsDescription || "",
  });

  const [newsImage, setNewsImage] = useState(newsData.newsImage || "");
  const [errors, setErrors] = useState({});
  const [backEndError, setBackEndError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.newsTitle) errors.newsTitle = "Title is required.";
    if (!formData.newsCategory) errors.newsCategory = "Category is required.";
    if (!formData.newsDescription)
      errors.newsDescription = "Description is required.";
    if (!newsImage) errors.newsImage = "News image is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setNewsImage(e.target.files[0]);
  };

  const handleDescriptionInputChange = (content, delta, source, editor) => {
    const plainText = editor.getText();
    setFormData((prevState) => ({
      ...prevState,
      newsDescription: plainText.trim(),
      richText: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("userId", formData.userId);
    formDataToSubmit.append("newsTitle", formData.newsTitle);
    formDataToSubmit.append("newsCategory", formData.newsCategory);
    formDataToSubmit.append("newsDescription", formData.newsDescription);
    if (newsImage) formDataToSubmit.append("newsImage", newsImage);

    const MAIN_URL = newsData._id
      ? `${BASE_URL}/api/news/updateNews/${newsData._id}`
      : `${BASE_URL}/api/news/addNews`;

    try {
      const response = newsData._id
        ? await axios.put(MAIN_URL, formDataToSubmit, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post(MAIN_URL, formDataToSubmit, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 201 || response.status === 200) {
        setBackEndError(
          <font color="green">
            {response.status === 201
              ? "Success TO ADD DATA."
              : "Success TO UPDATE DATA."}
          </font>
        );
        navigate("/news");
      } else {
        setBackEndError(
          <font color="red">
            {response.status === 400
              ? "ALL THE FIELDS ARE REQUIRED."
              : "INVALID USER DATA."}
          </font>
        );
      }
    } catch (error) {
      setBackEndError(
        <font color="red">
          Failed to submit data. There might be issues on the server.
        </font>
      );
    }
  };

  return (
    <div className="newNews">
      <Sidebar />
      <div className="newNewsContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1rem",
              width: "100%",
            }}
          >
            <Grid item xs={6}>
              <div className="file-upload">
                <input
                  accept="image/*"
                  id="newsImage"
                  type="file"
                  name="newsImage"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="newsImage">
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
                    newsImage
                      ? newsImage instanceof File
                        ? URL.createObjectURL(newsImage) // If the image is selected from the computer
                        : `${BASE_URL}${newsImage}` // If it's an updated image URL
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" // Default image if no image exists
                  }
                  alt="News"
                />
              </div>
              {errors.newsImage && (
                <span className="error-message">{errors.newsImage}</span>
              )}
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="newsTitle"
              value={formData.newsTitle}
              onChange={handleInputChange}
              error={Boolean(errors.newsTitle)}
              helperText={errors.newsTitle}
              style={{ minWidth: "600px" }} // Extended TextField length
              required
            />

            <FormControl
              style={{ width: "50%" }}
              margin="normal"
              error={Boolean(errors.newsCategory)}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="newsCategory"
                value={formData.newsCategory}
                onChange={handleInputChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="National">National</MenuItem>
                <MenuItem value="International">International</MenuItem>
              </Select>
              {errors.newsCategory && (
                <FormHelperText>{errors.newsCategory}</FormHelperText>
              )}
            </FormControl>

            <ReactQuill
              name="newsDescription"
              theme="snow"
              className="editor"
              onChange={handleDescriptionInputChange}
              value={formData.richText}
              placeholder="Write your description here..."
              style={{
                height: "250px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            {errors.newsDescription && (
              <span className="error-message">{errors.newsDescription}</span>
            )}

            <span className="error-message">{backEndError}</span>

            {/* Space between editor and button */}
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="submitButton"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsNew;

import "./newsNew.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const NewsNew = ({ inputs, title, userId }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate(); // Initialize navigate

  const { state } = useLocation(); // Access state passed from navigate
  const newsData = state?.news || {}; // Extract user data or use an empty object

  // populate formData with userData if editing
  const [formData, setFormData] = useState({
    userId: newsData.userId || "678eec7e68ead8d7db2f79eb",
    newsTitle: newsData.newsTitle || "",
    newsCategory: newsData.newsCategory || "",
    newsDescription: newsData.newsDescription || "",
    newsImage: newsData.newsImage || "",
    richText: "",
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
    console.log("==selected News image: " + e.target.files[0]);
    setNewsImage(e.target.files[0]);
  };

  const handleDescriptionInputChange = (content, delta, source, editor) => {
    // Get plain text from the editor
    const plainText = editor.getText();
    setFormData((prevState) => ({
      ...prevState,
      newsDescription: plainText.trim(), // Update the newsDescription with plain text
      richText: content, // Save HTML for ReactQuill
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare the form data for submission (add images if available)
    const formDataToSubmit = new FormData();

    formDataToSubmit.append("userId", formData.userId);
    formDataToSubmit.append("newsTitle", formData.newsTitle);
    formDataToSubmit.append("newsCategory", formData.newsCategory);
    formDataToSubmit.append("newsDescription", formData.newsDescription);
    // Append files (if available)
    if (newsImage) formDataToSubmit.append("newsImage", newsImage);

    /**
     *
     * choosing URL whether to update or add user
     *
     */
    const MAIN_URL = newsData._id
      ? `${BASE_URL}/api/news/updateNews/${newsData._id}`
      : `${BASE_URL}/api/news/addNews`;

    try {
      let response = "";
      if (newsData._id) {
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
        navigate("/news");
      } else if (response.status === 200) {
        setBackEndError(<font color="green">Success TO UPDATE DATA.</font>);
        navigate("/news");
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
    <div className="newNews">
      <Sidebar />
      <div className="newNewsContainer">
        <Navbar />
        <div className="bottom">
          <div className="containerNews">
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="file" className="imageLabel">
                Image:{" "}
                <input
                  type="file"
                  id="file"
                  name="newsImage"
                  onChange={handleFileChange}
                  className="icon"
                  // value={formData.newsImage}
                  // style={{ display: "none" }}
                />
              </label>
              {errors.newsImage && (
                <span className="error-message">{errors.newsImage}</span>
              )}

              <label htmlFor="file" className="imageLabel">
                Title:{" "}
                <input
                  className="titleInput"
                  type="text"
                  placeholder="Add Awesome Story"
                  name="newsTitle"
                  onChange={handleInputChange}
                  value={formData.newsTitle}
                />
              </label>
              {errors.newsTitle && (
                <span className="error-message">{errors.newsTitle}</span>
              )}

              <div className="categorySelect">
                <label htmlFor="" className="categoryLabel">
                  Choose a category:
                </label>
                <select
                  name="newsCategory"
                  id=""
                  onChange={handleInputChange}
                  value={formData.newsCategory}
                  className="select"
                >
                  <option value="Select">-Select-</option>
                  <option value="All">All</option>
                  <option value="Local">Local</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
                {errors.newsCategory && (
                  <span className="error-message">{errors.newsCategory}</span>
                )}
              </div>
              <div className="editorContainer">
                <ReactQuill
                  name="newsDescription"
                  theme="snow"
                  className="editor"
                  onChange={handleDescriptionInputChange}
                  value={formData.richText}
                  placeholder="Write your description here..."
                />
                {errors.newsDescription && (
                  <span className="error-message">
                    {errors.newsDescription}
                  </span>
                )}
              </div>
              <span className="error-message">{backEndError}</span>
              <button className="submitButton">{"Send"}</button>
            </form>
          </div>

          {/* <div className="left">
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
            
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NewsNew;

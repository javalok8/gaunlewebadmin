import React, { useState } from "react";
import axios from "axios";
import { DriveFolderUploadOutlined as UploadIcon } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";

const NewGhar = () => {
  const [homeData, setHomeData] = useState({
    name: "",
    address: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHomeData({ ...homeData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setHomeData({ ...homeData, images: files });

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", homeData.name);
    formData.append("address", homeData.address);
    homeData.images.forEach((file, index) => formData.append("images", file));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/homes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Home uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading home:", error);
      alert("Failed to upload home.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Upload Home</h2>
      <TextField
        name="name"
        label="Name"
        value={homeData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        name="address"
        label="Address"
        value={homeData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <div>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          style={{ margin: "10px 0" }}
        >
          Upload Images
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {previewImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index + 1}`}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        ))}
      </div>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default NewGhar;

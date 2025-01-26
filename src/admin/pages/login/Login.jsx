import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./login.scss";

import { setUserId } from "../../../reduxtool/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "Email is required.";
    } else if (!emailRegex.test(value)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Password is required.";
    }
    return "";
  };

  const handleLogin = async () => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    try {
      const response = await fetch(BASE_URL + "/api/users/loginAdminUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setUserId(data._id));
        navigate("/");
      } else {
        setEmailError("");
        setPasswordError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setEmailError("");
      setPasswordError("An error occurred while connecting to the server.");
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", flexWrap: "wrap", backgroundColor: "#1976d2" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={12}
        square
        sx={{ borderRadius: 20 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
            borderRadius: 50,
          }}
        >
          <img
            src="/img/logo.png"
            alt="Logo"
            style={{ width: "150px", borderRadius: "10%" }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value)); // Live validation
            }}
            error={!!emailError}
            helperText={emailError}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value)); // Live validation
            }}
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
            required
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              mb: 1,
              backgroundColor: "#1976d2",
              borderRadius: "25px",
              padding: "8px 16px", // Adjust padding for size
              width: "fit-content", // Ensure the button adjusts to its content
              alignSelf: "center", // Center the button within the parent container
            }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Dreamsoft Technology
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;

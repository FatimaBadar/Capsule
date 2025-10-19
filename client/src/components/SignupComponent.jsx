import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  Divider,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const { register } = useAuth();
  const navigate = useNavigate();

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim()) {
      showMessage("Please enter a username", "error");
      return;
    }
    if (username.trim().length < 3) {
      showMessage("Username must be at least 3 characters long", "error");
      return;
    }
    if (!email.trim()) {
      showMessage("Please enter your email address", "error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showMessage("Please enter a valid email address", "error");
      return;
    }
    if (!password.trim()) {
      showMessage("Please enter a password", "error");
      return;
    }
    if (password.trim().length < 6) {
      showMessage("Password must be at least 6 characters long", "error");
      return;
    }
    
    setLoader(true);

    try {
      const result = await register(username, email, password);

      if (result.success) {
        showMessage("Registration successful! Redirecting...", "success");
        setTimeout(() => {
          navigate("/account/dashboard");
        }, 1000);
      } else {
        showMessage(result.message || "Registration failed. Please check your credentials.", "error");
      }
    } catch (error) {
      showMessage("An unexpected error occurred. Please try again.", "error");
    } finally {
      setLoader(false);
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: '#00c389',
        light: '#00e6a0',
        dark: '#007a5f',
      },
      secondary: {
        main: '#009e8f',
        light: '#00b39f',
        dark: '#004c3f',
      },
    },
    typography: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            width: "100%",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
            borderRadius: "8px",
            "& .MuiInputLabel-root": {
              transform: "translateY(50%)",
            },
          },
          input: {
            borderRadius: "50%",
            height: "15px",
          },
        },
      },
    },
  });

  return (
    <>
      {loader ? (
        <Container
          maxWidth={false}
          sx={{ display: "flex", width: "fit-content", mt: "20%" }}
        >
          <CircularProgress size={"70px"} />
        </Container>
      ) : (
        <>
          <ThemeProvider theme={defaultTheme}>
            <Box
              // container
              // component={Paper}
              // elevation={24}
              // square={false}
              sx={{
                m: "auto",
                mt: 10,
                mb: 10,
                p: 3,
                width: "50%",
                borderRadius: "20px",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
              }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ fontWeight: 700 }}
                >
                  Sign Up
                </Typography>
                <Box
                  component="form"
                  onSubmit={submitSignup}
                  sx={{
                    width: "93%",
                    mt: 3,
                    textAlign: "center",
                  }}
                >
                  <TextField
                    margin="normal"
                    required
                    id="username"
                    label="Username"
                    name="username"
                    type="text"
                    autoFocus
                    autoComplete="username"
                    value={username}
                    onChange={onChange}
                    sx={{ display: "flex" }}
                    // focused
                  />
                  <TextField
                    margin="normal"
                    required
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    autoFocus
                    value={email}
                    onChange={onChange}
                    sx={{ display: "flex" }}
                  />
                  <TextField
                    margin="normal"
                    required
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    // minLength="8"
                    inputProps={{
                      minLength: 8,
                    }}
                    value={password}
                    onChange={onChange}
                    sx={{ display: "flex" }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loader}
                    sx={{
                      mt: 3,
                      mb: 2,
                      width: "100%",
                      display: "flex",
                      backgroundColor: "primary.main",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "&:disabled": {
                        backgroundColor: "secondary.main",
                        color: "#fff",
                      },
                    }}
                  >
                    {loader ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                  </Button>
                  
                  {message.text && (
                    <Alert 
                      severity={message.type} 
                      sx={{ mt: 2, mb: 2 }}
                      onClose={() => setMessage({ text: "", type: "" })}
                    >
                      {message.text}
                    </Alert>
                  )}
                  <Divider variant="middle" sx={{ mb: 2, mt: 3 }} />

                  <RouterLink
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      fontWeight: 600,
                      color: '#00c389',
                      textAlign: 'center',
                      display: 'block',
                    }}
                  >
                    <p style={{ margin: 0, '&:hover': { color: '#007a5f' } }}>
                      Already have an account? Login
                    </p>
                  </RouterLink>
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default Signup;

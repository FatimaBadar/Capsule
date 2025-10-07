import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  Divider,
  Container,
  CircularProgress,
} from "@mui/material";
import { Messages } from 'primereact/messages';

import { signupService } from "../services/authServices";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [message, setMessage] = useState("");

  const submitSignup = async (e) => {
    e.preventDefault();
    const tempUser = {
      firstname,
      lastname,
      username,
      email,
      password,
    };

    try {
      setLoader(true);

      const response = await signupService(tempUser);

      if (response.statusCode == "200") {
        setLoader(false);
        setSuccess(true);
        setMessage("You have successfully signed up!");
        
      } else {
        setLoader(false);
        setFailure(true);
        setMessage("Registration failed. Please check your credentials..");
      }

      setFirstname("");
      setLastname("");
      setUsername("");
      setEmail("");
      setPassword("");

      redirect("/");
    } catch (error) {
      setLoader(false);
      setFailure(true);
      setMessage("Registration failed. Please check your credentials..");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
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
                <Avatar sx={{ m: 1, bgcolor: "#597FB5" }}>
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
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    type="text"
                    variant="outlined"
                    autoFocus
                    autoComplete="username"
                    value={firstname}
                    onChange={onChange}
                    sx={{ display: "flex" }}
                    // focused
                  />
                  <TextField
                    margin="normal"
                    required
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    type="text"
                    autoFocus
                    autoComplete="username"
                    value={lastname}
                    onChange={onChange}
                    sx={{ display: "flex" }}
                    // focused
                  />
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
                    sx={{
                      mt: 3,
                      mb: 2,
                      width: "100%",
                      display: "flex",
                      backgroundColor: "#597FB5 !important",
                      color: "#fff !important",
                      "&:hover": {
                        backgroundColor: "#405D80 !important",
                      },
                    }}
                  >
                    Sign Up
                  </Button>

                  {success && <Messages severity="success" text={message} />}
                  {failure && <Messages severity="error" text={message} />}
                  <Divider variant="middle" sx={{ mb: 2, mt: 3 }} />

                  <Link
                    href="/login"
                    variant="body2"
                    textAlign="center"
                    sx={{
                      fontWeight: 600,
                      color: "#597FB5",
                      "&:hover": {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <p>Already have an account? Login</p>
                  </Link>
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

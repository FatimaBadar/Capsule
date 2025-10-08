import React, { useState } from "react";
import "./Dashboard.css";

import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";

import { Button as PrimeButton } from "primereact/button";
import { Messages } from "primereact/messages";
import { FileUpload } from "primereact/fileupload";
import { uploadService } from "../../services/clothingService";

// export default function
const UploadComponent = ({ onOpenUpload }) => {
  const [imageFile, setImageFile] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [category, setCategory] = useState("");
  const [seasonType, setSeasonType] = useState("");

  // const [openUpload, setOpenUpload] = useState(true);

  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [message, setMessage] = useState("");

  const closeUploadModal = () => onOpenUpload(false);

  const submitUploadClothes = async (e) => {
    e.preventDefault();
    const tempClothesData = {
      imageFile,
      title,
      description,
      fabric,
      category,
      seasonType,
      user: localStorage.getItem("user"),
    };

    try {
      setLoader(true);

      const response = await uploadService(tempClothesData);

      if (response.statusCode == "200") {
        setLoader(false);
        setSuccess(true);
        setMessage("New Item successfully added!");
      } else {
        setLoader(false);
        setFailure(true);
        setMessage("Could not add new item. Please add valid details..");
      }

      setImageFile("");
      setTitle("");
      setDescription("");
      setFabric("");
      setCategory("");
      setSeasonType("");
    } catch (error) {
      setLoader(false);
      setFailure(true);
      setMessage("Could not add new item. Please add valid details..");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "imageFile":
        setImageFile(value);
        break;
      case "title":
        setTitle(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "fabric":
        setFabric(value);
        break;
      case "seasonType":
        setSeasonType(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

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
          {/* <Box
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
              borderRadius: "10px",
              boxShadow: "0 6px 10px 0 rgba(0, 0, 0, 0.37)",
            }}
          > */}
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: "#597FB5" }}>
                <LockOutlinedIcon />
              </Avatar> 
              */}
            {/* <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>

              </Typography> */}
            <Box
              component="form"
              onSubmit={submitUploadClothes}
              sx={{
                width: "80%",
                // width: '360px',
                mt: 3,
                textAlign: "center",
              }}
            >
              <i
                className="pi pi-times"
                style={{
                  fontSize: "1.5rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  cursor: "pointer",
                  mt: 0,
                }}
                onClick={closeUploadModal}
              ></i>
              <FileUpload
                mode="basic"
                id="imageFile"
                name="imageFile"
                value={imageFile}
                onChange={(e) => setImageFile(e.target.files[0])}
                accept="image/*"
                maxFileSize={1000000}
                auto
                chooseLabel="Upload Image"
              />

              <TextField
                margin="normal"
                required
                id="title"
                label="Title"
                name="title"
                type="text"
                autoFocus
                autoComplete="title"
                value={title}
                onChange={onChange}
                sx={{ display: "flex" }}
              />

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  required
                  name="category"
                  value={category}
                  autoComplete="category"
                  onChange={onChange}
                  id="category"
                  label="Category"
                  sx={{ display: "flex", textAlign: "left" }}
                >
                  <MenuItem value={"shirt"}>Shirt</MenuItem>
                  <MenuItem value={"pants"}>Pants</MenuItem>
                  <MenuItem value={"jeans"}>Jeans</MenuItem>
                  <MenuItem value={"skirt"}>Skirt</MenuItem>
                  <MenuItem value={"coat"}>Coat</MenuItem>
                  <MenuItem value={"jacket"}>Jacket</MenuItem>
                  <MenuItem value={"dress"}>Dress</MenuItem>
                  <MenuItem value={"t-shirt"}>T-Shirt</MenuItem>
                  <MenuItem value={"shorts"}>Shorts</MenuItem>
                  <MenuItem value={"sweater"}>Sweater</MenuItem>
                  <MenuItem value={"hoodie"}>Hoodie</MenuItem>
                  <MenuItem value={"blouse"}>Blouse</MenuItem>
                  <MenuItem value={"suit"}>Suit</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Season Type</InputLabel>
                <Select
                  required
                  name="seasonType"
                  value={seasonType}
                  autoComplete="seasonType"
                  onChange={onChange}
                  id="seasonType"
                  label="seasonType"
                  sx={{ display: "flex", textAlign: "left" }}
                >
                  <MenuItem value={"summer"}>Summer</MenuItem>
                  <MenuItem value={"pants"}>Winter</MenuItem>
                  <MenuItem value={"spring"}>Spring</MenuItem>
                  <MenuItem value={"autumn"}>Autumn</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                name="fabric"
                label="Fabric type"
                type="text"
                id="fabric"
                autoComplete="fabric"
                value={fabric}
                onChange={onChange}
                sx={{ display: "flex" }}
              />

              <TextField
                margin="normal"
                name="description"
                label="Description"
                type="textarea"
                id="description"
                autoComplete="description"
                value={description}
                onChange={onChange}
                sx={{ display: "flex" }}
              />
              {/* <TextareaAutosize
                aria-label="minimum height"
                minRows={5}
                margin="normal"
                name="description"
                label="Description"
                type="text"
                id="description"
                autoComplete="description"
                value={description}
                onChange={onChange}
                sx={{ display: "flex", width: "100%" }}
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  p: 1.2,
                  width: "100%",
                  display: "flex",
                  backgroundColor: "#878787 !important",
                  color: "#fff !important",
                  "&:hover": {
                    backgroundColor: "#878787 !important",
                  },
                }}
              >
                Upload Clothes
              </Button>

              {success && <Messages severity="success" text={message} />}
              {failure && <Messages severity="error" text={message} />}
            </Box>
          </Box>
          {/* </Box> */}
        </>
      )}
    </>
  );
};

export default UploadComponent;

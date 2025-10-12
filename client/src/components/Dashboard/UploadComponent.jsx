import React, { useState, useEffect } from "react";
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
  Alert,
  Chip,
} from "@mui/material";
import axios from "axios";
import { Messages} from "primereact/messages";
import { FileUpload } from "primereact/fileupload";
import { uploadService } from "../../services/clothingService";

const API_URL = "http://localhost:3000/api/clothes";
// export default function
const UploadComponent = ({ onOpenUpload }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [category, setCategory] = useState("");
  const [seasonType, setSeasonType] = useState("");
  const [color, setColor] = useState("");
  const [loader, setLoader] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    const tempClothes = localStorage.getItem("newTempClothes");
    const tempClothesImage = localStorage.getItem("newTempClothesImage");

    if (tempClothes) {
      const aiItem = JSON.parse(tempClothes);
      const aiImage = JSON.parse(tempClothesImage);

      setImageFile(aiImage);
      setAiAnalysis(aiItem);
      setTitle(aiItem.title || "");
      setDescription(aiItem.description || "");
      setCategory(aiItem.category || "");
      setFabric(aiItem.fabric || "");
      setColor(aiItem.color || "");
      setSeasonType(aiItem.seasonType || "");
    }
    // return () => {
    //   localStorage.removeItem("newTempClothes");
    // }
  }, []);

  const resetForm = () => {
    setImageFile(null);
    setPreviewUrl("");
    setTitle("");
    setDescription("");
    setFabric("");
    setCategory("");
    setSeasonType("");
    setColor("");
    setAiAnalysis(null);
    setSuccess(false);
    setFailure(false);
    setMessage("");
  };

  const closeUploadModal = () => {
    onOpenUpload(false);
    resetForm();
  };

  // Trigger AI analysis on file select
  const handleFileSelect = async (e) => {
    const file = e.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAiAnalysis(null);
    setSuccess(false);
    setFailure(false);

    await analyzeWithAI(file);
  };

  const analyzeWithAI = async (file) => {
    setAnalyzing(true);
    setMessage("🤖 AI is analyzing your clothing...");

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      const response = await axios.post(`${API_URL}/analyze-ai`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === "200"
      ) {
        const aiItem = response.data.item;
        setAiAnalysis(aiItem);

        // Auto-fill fields
        setTitle(aiItem.title || "");
        setDescription(aiItem.description || "");
        setCategory(aiItem.category || "");
        setFabric(aiItem.fabric || "");
        setColor(aiItem.color || "");
        setSeasonType(aiItem.seasonType || "");

        localStorage.setItem("newTempClothes", JSON.stringify(aiItem));
        localStorage.setItem("newTempClothesImage", JSON.stringify(imageFile));

        setMessage("✅ AI Analysis Complete! Outfit generated.");
        setSuccess(true);
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      setMessage("⚠️ AI analysis failed. Please fill details manually.");
      setFailure(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const submitUploadClothes = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage("Please select an image file.");
      setFailure(true);
      return;
    }

    setLoader(true);
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("fabric", fabric);
    formData.append("category", category);
    formData.append("seasonType", seasonType);
    formData.append("color", color);
    formData.append("user", localStorage.getItem("user") || "default");

    try {
      const response = await axios.post(
        `${API_URL}/upload-clothing`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (
        response.data.statusCode === "200" ||
        response.data.statusCode === 200
      ) {
        setLoader(false);
        setSuccess(true);
        setMessage("New item successfully added!");
        // setTimeout(() => closeUploadModal(), 2000);
        // if (onUploadSuccess) onUploadSuccess(response.data.item);
        // setTimeout(() => closeUploadModal(), 2000);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setFailure(true);
      setMessage("Could not add new item. Please try again.");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
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
      case "color":
        setColor(value);
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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              onSubmit={submitUploadClothes}
              sx={{
                width: "80%",
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

              <h2 style={{ marginBottom: "20px" }}>Upload New Clothing</h2>

              {/* AI Analysis Status */}
              {analyzing && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <CircularProgress size={20} />
                    <span>🤖 AI is analyzing your clothing...</span>
                  </div>
                </Alert>
              )}

              {/* Image Preview */}
              {previewUrl && (
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                </Box>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <strong>🎯 AI Analysis Complete!</strong>
                  <Box
                    sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={`Category: ${aiAnalysis.category}`}
                      color="primary"
                      size="small"
                    />
                    {aiAnalysis.color && (
                      <Chip
                        label={`Color: ${aiAnalysis.color}`}
                        color="secondary"
                        size="small"
                      />
                    )}
                    <Chip
                      label={`Season: ${aiAnalysis.seasonType}`}
                      color="info"
                      size="small"
                    />
                  </Box>
                </Alert>
              )}

              <FileUpload
                id="imageFile"
                mode="basic"
                name="imageFile"
                accept="image/*"
                maxFileSize={10000000}
                onSelect={handleFileSelect}
                chooseLabel="Upload Image for AI Analysis"
                disabled={analyzing}
                auto={false}
                style={{ marginBottom: "20px" }}
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
                // disabled={!imageFile || analyzing}
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
                  // disabled={!imageFile || analyzing}
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

              <TextField
                margin="normal"
                name="color"
                label="Color"
                type="text"
                value={color}
                onChange={onChange}
                placeholder="e.g., Blue, Red, Black"
                sx={{ display: "flex" }}
                // disabled={!imageFile || analyzing}
              />

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
                  // disabled={!imageFile || analyzing}
                >
                  <MenuItem value={"all-season"}>All Seasons</MenuItem>

                  <MenuItem value={"summer"}>Summer</MenuItem>
                  <MenuItem value={"winter"}>Winter</MenuItem>
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
                // disabled={!imageFile || analyzing}
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
                // disabled={!imageFile || analyzing}
              />

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
                // disabled={!imageFile || analyzing}
              >
                {analyzing
                  ? "🔄 Analyzing with AI..."
                  : // : aiAnalysis
                    // ? "✅ Already Saved!"
                    "💾 Save to Wardrobe"}
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

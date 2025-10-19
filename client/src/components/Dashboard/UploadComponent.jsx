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
  easing,
} from "@mui/material";
import axios from "axios";
import { Messages } from "primereact/messages";
import { FileUpload } from "primereact/fileupload";
import { uploadService } from "../../services/clothingService";
import { useAuth } from "../../contexts/AuthContext.jsx";

const API_URL = "http://localhost:3000/api/clothes";
// export default function
const UploadComponent = ({ onOpenUpload }) => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [category, setCategory] = useState([]);
  const [seasonType, setSeasonType] = useState([]);
  const [color, setColor] = useState("");
  const [style, setStyle] = useState([]);
  const [customStyle, setCustomStyle] = useState("");
  const [occasion, setOccasion] = useState([]);
  const [customOccasion, setCustomOccasion] = useState("");
  // const [weather, setWeather] = useState("");
  // const [tags, setTags] = useState("");
  const [loader, setLoader] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

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
      setCategory(Array.isArray(aiItem.category) ? aiItem.category : [aiItem.category || ""]);
      setFabric(aiItem.fabric || "");
      setColor(aiItem.color || "");
      setSeasonType(Array.isArray(aiItem.seasonType) ? aiItem.seasonType : [aiItem.seasonType || ""]);
    }
    // return () => {
    //   localStorage.removeItem("newTempClothes");
    // }
  }, []);

  const resetForm = () => {
    setImageFile(null);
    setPreviewUrl("");
    setTitle("");
    setName("");
    setDescription("");
    setFabric("");
    setCategory([]);
    setSeasonType([]);
    setColor("");
    setStyle([]);
    setCustomStyle("");
    setOccasion([]);
    setCustomOccasion("");
    // setWeather("");
    // setTags("");
    setAiAnalysis(null);
  };

  const closeUploadModal = () => {
    onOpenUpload(false);
    resetForm();
  };

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
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
        setCategory(Array.isArray(aiItem.category) ? aiItem.category : [aiItem.category || ""]);
        setFabric(aiItem.fabric || "");
        setColor(aiItem.color || "");
        setSeasonType(Array.isArray(aiItem.seasonType) ? aiItem.seasonType : [aiItem.seasonType || ""]);
        setStyle(Array.isArray(aiItem.style) ? aiItem.style : [aiItem.style || ""]);
        setOccasion(Array.isArray(aiItem.occasion) ? aiItem.occasion : [aiItem.occasion || ""]);
        // setWeather(aiItem.weather || "");

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

    // Validation
    if (!imageFile) {
      showMessage("Please select an image file.", "error");
      return;
    }
    if (!title.trim()) {
      showMessage("Please enter a title for the item.", "error");
      return;
    }
    if (!category || (Array.isArray(category) && category.length === 0) || (Array.isArray(category) && category[0] === "")) {
      showMessage("Please select a category.", "error");
      return;
    }
    if (!color.trim()) {
      showMessage("Please enter a color.", "error");
      return;
    }

    setLoader(true);
    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("title", title);
    formData.append("name", name || title);
    formData.append("description", description);
    formData.append("fabric", fabric);
    formData.append("category", Array.isArray(category) ? category.join(',') : category);
    formData.append("seasonType", Array.isArray(seasonType) ? seasonType.join(',') : seasonType);
    formData.append("color", color);
    formData.append("style", Array.isArray(style) ? style.join(',') : style);
    formData.append(
      "occasion",
      Array.isArray(occasion) ? occasion.join(',') : occasion
    );
    // formData.append("weather", weather);
    // formData.append("tags", tags);
    formData.append("user", user?.username || "default");

    try {
      const response = await axios.post(
        `${API_URL}/upload-clothing`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (
        response.data.statusCode === "200" ||
        response.data.statusCode === 200 ||
        (response.data.item && response.data.message === "Clothing saved successfully")
      ) {
        showMessage("New item successfully added!", "success");
        resetForm();
        if (onUploadSuccess) onUploadSuccess(response.data.item);
        setTimeout(() => closeUploadModal(), 1500);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage(
        error.response?.data?.message ||
          "Could not add new item. Please try again.",
        "error"
      );
    } finally {
      setLoader(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "name":
        setName(value);
        break;
      case "category":
        setCategory([value]);
        break;
      case "fabric":
        setFabric(value);
        break;
      case "seasonType":
        setSeasonType([value]);
        break;
      case "description":
        setDescription(value);
        break;
      case "color":
        setColor(value);
        break;
      case "style":
        setStyle([value]);
        break;
      case "customStyle":
        setCustomStyle(value);
        break;
      case "occasion":
        setOccasion([value]);
        break;
      case "customOccasion":
        setCustomOccasion(value);
        break;
      // case "weather":
      //   setWeather(value);
      //   break;
      // case "tags":
      //   setTags(value);
      //   break;
      default:
        break;
    }
  };
  const handleOccasionChange = (event) => {
    const value = event.target.value;
    setOccasion([value]);
  };

  const handleStyleChange = (event) => {
    const value = event.target.value;
    setStyle([value]);
  };

  const handleSeasonTypeChange = (event) => {
    const value = event.target.value;
    setSeasonType([value]);
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
                  value={Array.isArray(category) ? category[0] || "" : category}
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
                  <MenuItem value={"shoes"}>Shoes</MenuItem>
                  <MenuItem value={"accessories"}>Accessories</MenuItem>
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
                  // value={seasonType}
                  autoComplete="seasonType"
                  // onChange={onChange}

                  value={Array.isArray(seasonType) ? seasonType[0] || "" : seasonType}
                  onChange={handleSeasonTypeChange}
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
                  {Array.isArray(seasonType) ? (
                    seasonType.map((occ, index) => (
                      <MenuItem key={index} value={occ}>
                        {occ}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={seasonType}>{seasonType}</MenuItem>
                  )}
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

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Style</InputLabel>
                <Select
                  name="style"
                  value={Array.isArray(style) ? style[0] || "" : style}
                  onChange={handleStyleChange}
                  id="style"
                  label="Style"
                  sx={{ display: "flex", textAlign: "left" }}
                >
                  <MenuItem value="">Select Style</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="sporty">Sporty</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="elegant">Elegant</MenuItem>
                  <MenuItem value="bohemian">Bohemian</MenuItem>
                  <MenuItem value="vintage">Vintage</MenuItem>
                  <MenuItem value="minimalist">Minimalist</MenuItem>
                  <MenuItem value="streetwear">Streetwear</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  {Array.isArray(style) ? (
                    style.map((occ, index) => (
                      <MenuItem key={index} value={occ}>
                        {occ}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={style}>{style}</MenuItem>
                  )}
                </Select>
              </FormControl>

              {style === "other" && (
                <TextField
                  margin="normal"
                  name="customStyle"
                  label="Custom Style"
                  type="text"
                  value={customStyle}
                  onChange={onChange}
                  placeholder="Enter custom style"
                  sx={{ display: "flex" }}
                />
              )}

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Occasion</InputLabel>
                <Select
                  name="occasion"
                  id="occasion"
                  label="Occasion"
                  sx={{ display: "flex", textAlign: "left" }}
                  value={Array.isArray(occasion) ? occasion[0] || "" : occasion}
                  onChange={handleOccasionChange}
                >
                  <MenuItem value="">Select Occasion</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="party">Party</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="gym">Gym</MenuItem>
                  <MenuItem value="travel">Travel</MenuItem>
                  <MenuItem value="wedding">Wedding</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="shopping">Shopping</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  {Array.isArray(occasion) ? (
                    occasion.map((occ, index) => (
                      <MenuItem key={index} value={occ}>
                        {occ}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={occasion}>{occasion}</MenuItem>
                  )}
                </Select>
              </FormControl>

              {occasion === "other" && (
                <TextField
                  margin="normal"
                  name="customOccasion"
                  label="Custom Occasion"
                  type="text"
                  value={customOccasion}
                  onChange={onChange}
                  placeholder="Enter custom occasion"
                  sx={{ display: "flex" }}
                />
              )}

              {/* <FormControl fullWidth variant="outlined" margin="normal">
                 <InputLabel>Weather</InputLabel>
                <Select
                  name="weather"
                  value={weather}
                  onChange={onChange}
                  id="weather"
                  label="Weather"
                  sx={{ display: "flex", textAlign: "left" }}
                >
                  <MenuItem value="">Any Weather</MenuItem>
                  <MenuItem value="summer">Summer</MenuItem>
                  <MenuItem value="winter">Winter</MenuItem>
                  <MenuItem value="spring">Spring</MenuItem>
                  <MenuItem value="fall">Fall</MenuItem>
                </Select>
              </FormControl> */}

              {/* <TextField
                margin="normal"
                name="tags"
                label="Tags (Optional)"
                type="text"
                value={tags}
                onChange={onChange}
                placeholder="e.g., vintage, trendy, comfortable (comma separated)"
                helperText="Add descriptive tags to help with outfit suggestions and search"
                sx={{ display: "flex" }}
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
                  backgroundColor: "#00c389",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#007a5f",
                  },
                  "&:disabled": {
                    backgroundColor: "#009e8f",
                    color: "#fff",
                  },
                }}
                disabled={!imageFile || analyzing}
              >
                {analyzing ? "🔄 Analyzing with AI..." : "💾 Save to Wardrobe"}
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
            </Box>
          </Box>
          {/* </Box> */}
        </>
      )}
    </>
  );
};

export default UploadComponent;

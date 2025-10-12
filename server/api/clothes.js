import multer from "multer";
import { Router } from "express";
import Clothes from "../models/clothes.js";
import {
  analyzeClothingWithAI,
  generateOutfit,
} from "../services/AIService.js";

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

// Analyze clothing via AI
router.post("/analyze-ai", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Full public URL for Hugging Face
    const fileURL = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    const analysis = await analyzeClothingWithAI(fileURL);

    res.json({ statusCode: 200, item: analysis });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

router.post(
  "/upload-clothing",
  upload.single("imageFile"),
  async (req, res) => {
    try {
      const { title, description, fabric, category, seasonType, color, user } =
        req.body;

      // Optional: store image buffer or URL if you want
      const imageUrl = req.file ? `/uploads/${req.file.originalname}` : "";

      const newClothing = new Clothes({
        title,
        description,
        fabric,
        category,
        seasonType,
        color,
        user,
        imageUrl,
        createdAt: new Date(),
      });

      const savedItem = await newClothing.save();

      res.json({
        statusCode: 200,
        message: "Clothing saved successfully",
        item: savedItem,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ statusCode: 500, message: "Failed to save clothing" });
    }
  }
);

router.get("/get-all-clothes", async (req, res) => {
  try {
    const allClothes = await Clothes.find().sort({ createdAt: -1 });
    res.json({
      statusCode: 200,
      items: allClothes,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ statusCode: 500, message: "Failed to fetch clothes" });
  }
});

router.get("/generate-outfits", async (req, res) => {
  try {
    const clothes = await Clothes.find().sort({ createdAt: -1 });

    if (!clothes || clothes.length === 0) {
      return res.status(404).json({ message: "No clothes found" });
    }

    const outfitResults = [];

    for (let item of clothes) {
      if (!item.description) continue;

      try {
        const result = await generateOutfit({ description: item.description });

        // Ensure result is an array and has url
        const imageUrl =
          Array.isArray(result) && result[0]?.url ? result[0].url : "";
        outfitResults.push({
          id: item.id,
          title: item.title,
          imageUrl,
        });
      } catch (err) {
        console.error(`Failed for item ${item.id}:`, err.message);
      }
    }

    res.json(outfitResults);
  } catch (err) {
    console.error("Generate outfits API failed:", err);
    res.status(500).json({ message: "Failed to generate outfits" });
  }
});

export default router;

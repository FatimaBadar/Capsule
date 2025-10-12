import multer from "multer";
import { Router } from "express";
import Clothes from "../models/clothes.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import {
  analyzeClothingWithAI,
  generateOutfit,
} from "../services/AIService.js";

const router = Router();

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "uploads/",
//     filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
//   }),
// });

// Multer setup with safe unique filenames
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const safeName = slugify(file.originalname, {
        lower: true,
        strict: true,
      });
      const uniqueName = `${uuidv4()}-${safeName}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
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
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      const filePath = path.join("uploads", req.file.filename);
      const imageData = fs.readFileSync(filePath);

      const newClothing = new Clothes({
        title,
        description,
        fabric,
        category,
        seasonType,
        color,
        user,
        imageUrl: `/uploads/${req.file.filename}`, //public url
        image: {
          data: imageData, //blob
          contentType: req.file.mimetype,
        },
        createdAt: new Date(),
      });

      const savedItem = await newClothing.save();

      //  Delete the old temporary file if renamed already
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

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

const itemsWithImages = allClothes.map(item => {
  let base64Image = null;
  if (item.image?.data) {
    // Convert Mongoose buffer to base64 string
    base64Image = `data:${item.image.contentType};base64,${Buffer.from(item.image.data).toString("base64")}`;
  }

  return {
    id: item._id,
    title: item.title,
    description: item.description,
    fabric: item.fabric,
    category: item.category,
    seasonType: item.seasonType,
    color: item.color,
    user: item.user,
    createdAt: item.createdAt,
    imageUrl: item.imageUrl,
    imageBase64: base64Image,
  };
});
    res.json({ statusCode: 200, items: itemsWithImages });
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
          // Array.isArray(result) && result[0]?.url ? result[0].url : "";
          outfitResults.push({
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
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

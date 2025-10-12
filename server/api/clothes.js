import multer from "multer";
import { Router } from "express";
import { analyzeClothingWithAI, generateOutfit } from "../services/AIService.js";

const router = Router();

const upload = multer({ storage: multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})});

// Analyze clothing via AI
router.post("/analyze-ai", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Full public URL for Hugging Face
    const fileURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const analysis = await analyzeClothingWithAI(fileURL);

    res.json({ statusCode: 200, item: analysis });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// Generate Outfit Only
router.post("/generate-outfit", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const outfitImage = await generateOutfit(req.file.buffer, req.file.mimetype);
    res.json({ outfitImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

import multer from "multer";
import { Router } from "express";
import Clothes from "../models/clothes.js";
import User from "../models/user.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import axios from "axios";
import sharp from "sharp";
import { authenticateToken } from "./auth.js";
import {
  analyzeClothingWithAI,
  generateOutfit,
  generateMultipleOutfits,
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
  authenticateToken,
  upload.single("imageFile"),
  async (req, res) => {
    try {
      const { 
        title, 
        name, 
        description, 
        fabric, 
        category, 
        seasonType, 
        color, 
        style,
        occasion,
        weather,
        tags,
        user 
      } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }
      
      const filePath = path.join("uploads", req.file.filename);
      const imageData = fs.readFileSync(filePath);

      const newClothing = new Clothes({
        userId: req.user.userId,
        title,
        name: name || title,
        description,
        fabric,
        category,
        seasonType,
        color,
        style,
        occasion,
        weather,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        user, // Keep for backward compatibility
        imageUrl: `/uploads/${req.file.filename}`, //public url
        image: {
          data: imageData, //blob
          contentType: req.file.mimetype,
        },
        createdAt: new Date(),
      });

      const savedItem = await newClothing.save();

      // Add to user's wardrobe
      await User.findByIdAndUpdate(req.user.userId, {
        $push: { wardrobe: savedItem._id }
      });

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

// Get user's wardrobe
router.get("/get-all-clothes", authenticateToken, async (req, res) => {
  try {
    const allClothes = await Clothes.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    const itemsWithImages = allClothes.map((item) => {
      let base64Image = null;
      if (item.image?.data) {
        // Convert Mongoose buffer to base64 string
        base64Image = `data:${item.image.contentType};base64,${Buffer.from(
          item.image.data
        ).toString("base64")}`;
      }

      return {
        id: item._id,
        _id: item._id,
        title: item.title,
        name: item.name || item.title,
        description: item.description,
        fabric: item.fabric,
        category: item.category,
        seasonType: item.seasonType,
        color: item.color,
        style: item.style,
        occasion: item.occasion,
        weather: item.weather,
        tags: item.tags,
        user: item.user,
        createdAt: item.createdAt,
        imageUrl: item.imageUrl,
        imageBase64: base64Image,
      };
    });
    res.json({ statusCode: 200, items: itemsWithImages, wardrobe: itemsWithImages });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ statusCode: 500, message: "Failed to fetch clothes" });
  }
});

// Get all clothes (for backward compatibility)
router.get("/wardrobe", authenticateToken, async (req, res) => {
  try {
    const clothingItems = await Clothes.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ wardrobe: clothingItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete clothing item
router.delete("/wardrobe/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Clothes.findOne({ _id: id, userId: req.user.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete the image file
    if (item.imageUrl) {
      const imagePath = path.join(__dirname, '..', item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Clothes.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { wardrobe: id }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get weather data
router.get("/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!city || city.trim().length === 0) {
      return res.status(400).json({ message: 'City name is required' });
    }
    
    const API_KEY = process.env.WEATHER_API_KEY || 'your-weather-api-key';
    
    if (API_KEY === 'your-weather-api-key') {
      return res.status(400).json({ message: 'Weather API key not configured' });
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weather = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main
    };

    res.json({ weather });
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'City not found' });
    } else if (error.response?.status === 401) {
      res.status(401).json({ message: 'Invalid weather API key' });
    } else {
      res.status(500).json({ message: 'Weather data unavailable', error: error.message });
    }
  }
});

// Get clothing suggestions (rule-based)
router.post("/suggestions", authenticateToken, async (req, res) => {
  try {
    const { preferences, weather, occasion } = req.body;
    
    // Validate input
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ message: 'Preferences object is required' });
    }
    
    // Get user's wardrobe
    const wardrobe = await Clothes.find({ userId: req.user.userId });
    
    if (wardrobe.length === 0) {
      return res.json({ suggestions: [], message: 'No items in wardrobe' });
    }

    // Simple suggestion algorithm
    let suggestions = wardrobe.filter(item => {
      let matches = true;

      // Filter by occasion
      if (occasion && item.occasion && item.occasion !== occasion) {
        matches = false;
      }

      // Filter by weather
      if (weather && item.weather && item.weather !== weather) {
        matches = false;
      }

      // Filter by color preference
      if (preferences.color && item.color !== preferences.color) {
        matches = false;
      }

      return matches;
    });

    // If no matches, return all items
    if (suggestions.length === 0) {
      suggestions = wardrobe;
    }

    // Group by category
    const groupedSuggestions = {
      tops: suggestions.filter(item => ['top', 'shirt', 't-shirt', 'blouse', 'sweater', 'hoodie'].includes(item.category)),
      bottoms: suggestions.filter(item => ['bottom', 'pants', 'jeans', 'skirt', 'shorts'].includes(item.category)),
      shoes: suggestions.filter(item => item.category === 'shoes'),
      accessories: suggestions.filter(item => item.category === 'accessories')
    };

    res.json({ suggestions: groupedSuggestions, type: 'rule-based' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get AI-powered outfit suggestions
router.post("/suggestions/ai", authenticateToken, async (req, res) => {
  try {
    const { preferences, weather, occasion } = req.body;
    
    // Validate input
    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ message: 'Preferences object is required' });
    }
    
    // Get user's wardrobe
    const wardrobe = await Clothes.find({ userId: req.user.userId });
    
    if (wardrobe.length === 0) {
      return res.json({ outfit: null, message: 'No items in wardrobe' });
    }

    // AI-powered outfit coordination algorithm
    const outfit = generateAIOutfits(wardrobe, { preferences, weather, occasion });

    res.json({ outfit, type: 'ai-powered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// AI outfit generation function
function generateAIOutfits(wardrobe, criteria) {
  const { preferences, weather, occasion } = criteria;
  
  // Separate items by category
  const tops = wardrobe.filter(item => ['top', 'shirt', 't-shirt', 'blouse', 'sweater', 'hoodie'].includes(item.category));
  const bottoms = wardrobe.filter(item => ['bottom', 'pants', 'jeans', 'skirt', 'shorts'].includes(item.category));
  const shoes = wardrobe.filter(item => item.category === 'shoes');
  const accessories = wardrobe.filter(item => item.category === 'accessories');
  
  // Scoring system for outfit coordination
  function scoreItem(item, context) {
    let score = 0;
    
    // Weather compatibility
    if (weather && item.weather) {
      if (item.weather === weather) score += 3;
      else if (isWeatherCompatible(item.weather, weather)) score += 1;
    }
    
    // Occasion compatibility
    if (occasion && item.occasion) {
      if (item.occasion === occasion) score += 3;
      else if (isOccasionCompatible(item.occasion, occasion)) score += 1;
    }
    
    // Color preference
    if (preferences.color && item.color === preferences.color) {
      score += 2;
    }
    
    // Style preference
    if (preferences.style && item.style === preferences.style) {
      score += 2;
    }
    
    return score;
  }
  
  // Generate multiple outfit combinations
  const outfits = [];
  
  // Try to create 3 different outfit combinations
  for (let i = 0; i < 3; i++) {
    const outfit = {
      id: i + 1,
      name: `Outfit ${i + 1}`,
      items: [],
      score: 0,
      description: ''
    };
    
    // Select top
    if (tops.length > 0) {
      const scoredTops = tops.map(top => ({
        item: top,
        score: scoreItem(top, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredTops[0].item);
      outfit.score += scoredTops[0].score;
    }
    
    // Select bottom
    if (bottoms.length > 0) {
      const scoredBottoms = bottoms.map(bottom => ({
        item: bottom,
        score: scoreItem(bottom, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredBottoms[0].item);
      outfit.score += scoredBottoms[0].score;
    }
    
    // Select shoes
    if (shoes.length > 0) {
      const scoredShoes = shoes.map(shoe => ({
        item: shoe,
        score: scoreItem(shoe, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredShoes[0].item);
      outfit.score += scoredShoes[0].score;
    }
    
    // Select one accessory (optional)
    if (accessories.length > 0 && Math.random() > 0.3) {
      const scoredAccessories = accessories.map(accessory => ({
        item: accessory,
        score: scoreItem(accessory, { preferences, weather, occasion })
      })).sort((a, b) => b.score - a.score);
      
      outfit.items.push(scoredAccessories[0].item);
      outfit.score += scoredAccessories[0].score;
    }
    
    // Generate outfit description
    outfit.description = generateOutfitDescription(outfit.items, weather, occasion);
    
    if (outfit.items.length > 0) {
      outfits.push(outfit);
    }
  }
  
  // Sort outfits by score and return the best ones
  return outfits.sort((a, b) => b.score - a.score);
}

// Helper functions for compatibility
function isWeatherCompatible(itemWeather, targetWeather) {
  const compatibility = {
    'summer': ['spring'],
    'winter': ['fall'],
    'spring': ['summer', 'fall'],
    'fall': ['winter', 'spring']
  };
  return compatibility[itemWeather]?.includes(targetWeather) || false;
}

function isOccasionCompatible(itemOccasion, targetOccasion) {
  const compatibility = {
    'casual': ['work'],
    'work': ['casual'],
    'formal': ['party'],
    'party': ['formal']
  };
  return compatibility[itemOccasion]?.includes(targetOccasion) || false;
}

function generateOutfitDescription(items, weather, occasion) {
  const categories = items.map(item => item.category);
  const colors = items.map(item => item.color);
  const styles = items.filter(item => item.style).map(item => item.style);
  
  let description = `A ${categories.join(' and ')} combination`;
  
  if (colors.length > 0) {
    description += ` featuring ${colors.join(', ')} colors`;
  }
  
  if (styles.length > 0) {
    description += ` with a ${styles[0]} style`;
  }
  
  if (weather) {
    description += `, perfect for ${weather} weather`;
  }
  
  if (occasion) {
    description += ` and ideal for ${occasion} occasions`;
  }
  
  return description + '.';
}

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
        let base64Image = null;
        if (item.image?.data) {
          // Convert Mongoose buffer to base64 string
          base64Image = `data:${item.image.contentType};base64,${Buffer.from(
            item.image.data
          ).toString("base64")}`;
        }
        // Ensure result is an array and has url
        const imageUrl =
          // Array.isArray(result) && result[0]?.url ? result[0].url : "";
          outfitResults.push({
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            imageBase64: base64Image,
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

// Enhanced outfit generation with weather and preferences
router.post("/outfits/generate", authenticateToken, async (req, res) => {
  try {
    const { style, color, weather, occasion, city } = req.body;
    const userId = req.user.userId;

    // Get user's wardrobe
    const userClothes = await Clothes.find({ userId });
    
    // Prepare preferences for AI
    const preferences = {
      style,
      color,
      weather,
      occasion,
      userClothes: userClothes.map(item => ({
        title: item.title,
        color: item.color,
        category: item.category,
        style: item.style,
        occasion: item.occasion
      }))
    };
    
    // Generate multiple outfit suggestions
    const outfits = await generateMultipleOutfits(preferences, 3);
    
    res.json({
      statusCode: 200,
      message: "Outfit suggestions generated successfully",
      outfits,
      weather: weather || null,
      preferences
    });
  } catch (error) {
    console.error("Outfit generation error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to generate outfit suggestions"
    });
  }
});

// Save outfit to user's favorites
router.post("/outfits/save", authenticateToken, async (req, res) => {
  try {
    const { outfit } = req.body;
    const userId = req.user.userId;

    // Here you would save the outfit to a separate Outfit collection
    // For now, we'll just return success
    res.json({
      statusCode: 200,
      message: "Outfit saved successfully",
      outfit: {
        ...outfit,
        userId,
        savedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Save outfit error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to save outfit"
    });
  }
});

export default router;

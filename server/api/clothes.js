// server/api/clothes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Clothes from "../models/clothes.js";
import axios from "axios";
import { Router } from "express";
import AIService from "../services/AIService.js";

const router = Router();


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// ==================== ROUTES ====================

// 1. Upload and Analyze Clothing with AI
router.post('/upload-clothing', upload.single('imageFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        statusCode: '400',
        error: 'No image file provided' 
      });
    }

    const { title, description, fabric, category, seasonType, user } = req.body;
    const imagePath = path.join(__dirname, '../../uploads', req.file.filename);

    console.log('🔍 Analyzing clothing with AI...');

    // Get AI analysis in parallel
    const [embedding, aiDescription] = await Promise.all([
      AIService.getImageEmbedding(imagePath),
      AIService.analyzeClothing(imagePath)
    ]);

    // Auto-suggest category and color if not provided
    const suggestedCategory = category || AIService.suggestCategory(aiDescription);
    const extractedColor = AIService.extractColor(aiDescription);

    // Create clothes document
    const clothingItem = new Clothes({
      title: title || suggestedCategory,
      description: description || aiDescription,
      fabric: fabric || '',
      category: suggestedCategory,
      color: extractedColor,
      seasonType: seasonType || 'all',
      imageFile: req.file.filename,
      user: user || 'default',
      aiDescription,
      embedding,
      suggestedCategory
    });

    await clothingItem.save();

    console.log('✅ Clothing item saved with AI analysis');

    res.json({
      statusCode: '200',
      success: true,
      item: {
        ...clothingItem.toJSON(),
        embedding: undefined // Don't send full embedding to client
      },
      message: 'Clothing analyzed and saved successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if save failed
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      statusCode: '500',
      error: error.message || 'Failed to upload clothing'
    });
  }
});

// 2. Get All Clothes for a User
router.get('/wardrobe/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const clothes = await Clothes.find({ user: userId })
      .sort({ uploadedAt: -1 })
      .select('-embedding'); // Exclude embedding from response

    res.json({
      statusCode: '200',
      success: true,
      items: clothes,
      count: clothes.length
    });
  } catch (error) {
    console.error('Get wardrobe error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// 3. Find Similar Items using AI
router.post('/find-similar', async (req, res) => {
  try {
    const { itemId, topK = 5 } = req.body;

    const targetItem = await Clothes.findById(itemId);
    if (!targetItem) {
      return res.status(404).json({ 
        statusCode: '404',
        error: 'Item not found' 
      });
    }

    if (!targetItem.embedding || targetItem.embedding.length === 0) {
      return res.status(400).json({
        statusCode: '400',
        error: 'Item has no AI embedding. Please re-upload.'
      });
    }

    // Get all other items from same user
    const allItems = await Clothes.find({
      user: targetItem.user,
      _id: { $ne: itemId }
    });

    // Find similar items using AI
    const similarities = AIService.findSimilarItems(
      targetItem.embedding,
      allItems,
      topK
    );

    res.json({
      statusCode: '200',
      success: true,
      targetItem: {
        ...targetItem.toJSON(),
        embedding: undefined
      },
      similarItems: similarities.map(s => ({
        ...s.item.toJSON(),
        embedding: undefined,
        similarityScore: (s.similarity * 100).toFixed(2)
      }))
    });
  } catch (error) {
    console.error('Find similar error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// 4. Get Smart Outfit Recommendations
router.post('/recommend-outfits', async (req, res) => {
  try {
    const { userId, weather, occasion = 'casual' } = req.body;

    // Get user's wardrobe
    let wardrobe = await Clothes.find({ user: userId });

    if (wardrobe.length < 2) {
      return res.json({
        statusCode: '200',
        success: true,
        outfits: [],
        message: 'Add more items to get outfit recommendations'
      });
    }

    // Filter by weather if provided
    if (weather && weather.temperature !== undefined) {
      wardrobe = filterByWeather(wardrobe, weather);
    }

    // Group by category
    const tops = wardrobe.filter(i => 
      ['shirt', 't-shirt', 'blouse', 'top'].includes(i.category)
    );
    const bottoms = wardrobe.filter(i => 
      ['pants', 'jeans', 'shorts', 'skirt'].includes(i.category)
    );
    const dresses = wardrobe.filter(i => i.category === 'dress');
    const outerwear = wardrobe.filter(i => 
      ['jacket', 'coat', 'sweater', 'hoodie'].includes(i.category)
    );

    // Generate outfits with AI compatibility scoring
    const outfits = [];

    // Outfit type 1: Top + Bottom
    for (const top of tops.slice(0, 5)) {
      for (const bottom of bottoms.slice(0, 3)) {
        if (!top.embedding || !bottom.embedding) continue;

        const compatibility = AIService.cosineSimilarity(
          top.embedding,
          bottom.embedding
        );

        if (compatibility > 0.3) {
          const outfit = {
            id: `outfit-${top._id}-${bottom._id}`,
            items: [top, bottom],
            type: 'top-bottom',
            compatibilityScore: (compatibility * 100).toFixed(2),
            occasion
          };

          // Add outerwear if cold weather
          if (weather?.temperature < 15 && outerwear.length > 0) {
            outfit.items.push(outerwear[0]);
          }

          outfits.push(outfit);
        }
      }
    }

    // Outfit type 2: Dresses
    for (const dress of dresses.slice(0, 3)) {
      outfits.push({
        id: `outfit-dress-${dress._id}`,
        items: [dress],
        type: 'dress',
        compatibilityScore: 100,
        occasion
      });
    }

    // Sort by compatibility
    const topOutfits = outfits
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 5)
      .map(outfit => ({
        ...outfit,
        items: outfit.items.map(item => ({
          ...item.toJSON(),
          embedding: undefined
        }))
      }));

    res.json({
      statusCode: '200',
      success: true,
      outfits: topOutfits,
      totalCombinations: outfits.length
    });
  } catch (error) {
    console.error('Outfit recommendation error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// 5. Weather-based Outfit Recommendations
router.post('/weather-outfit', async (req, res) => {
  try {
    const { location, userId } = req.body;

    if (!process.env.WEATHER_API_KEY) {
      return res.status(500).json({
        statusCode: '500',
        error: 'Weather API key not configured'
      });
    }

    // Fetch weather
    const weatherResponse = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: location,
          appid: process.env.WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    const weather = {
      temperature: weatherResponse.data.main.temp,
      condition: weatherResponse.data.weather[0].main.toLowerCase(),
      description: weatherResponse.data.weather[0].description,
      humidity: weatherResponse.data.main.humidity
    };

    // Get outfit recommendations
    const outfitsResponse = await axios.post(
      `${req.protocol}://${req.get('host')}/api/recommend-outfits`,
      { userId, weather }
    );

    res.json({
      statusCode: '200',
      success: true,
      weather,
      recommendations: getWeatherAdvice(weather),
      outfits: outfitsResponse.data.outfits || []
    });
  } catch (error) {
    console.error('Weather outfit error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// 6. Search Wardrobe
router.post('/search-wardrobe', async (req, res) => {
  try {
    const { query, userId } = req.body;

    const results = await Clothes.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { color: { $regex: query, $options: 'i' } },
        { aiDescription: { $regex: query, $options: 'i' } }
      ]
    }).select('-embedding');

    res.json({
      statusCode: '200',
      success: true,
      query,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// 7. Delete Clothing Item
router.delete('/clothes/:id', async (req, res) => {
  try {
    const clothing = await Clothes.findById(req.params.id);
    
    if (!clothing) {
      return res.status(404).json({
        statusCode: '404',
        error: 'Item not found'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../../uploads', clothing.imageFile);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Clothes.findByIdAndDelete(req.params.id);

    res.json({
      statusCode: '200',
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      statusCode: '500',
      error: error.message
    });
  }
});

// ==================== HELPER FUNCTIONS ====================

function filterByWeather(items, weather) {
  const temp = weather.temperature;
  
  if (temp < 10) {
    return items.filter(i => ['winter', 'all'].includes(i.seasonType));
  } else if (temp < 20) {
    return items.filter(i => ['autumn', 'spring', 'all'].includes(i.seasonType));
  } else {
    return items.filter(i => ['summer', 'spring', 'all'].includes(i.seasonType));
  }
}

function getWeatherAdvice(weather) {
  const advice = { layers: [], accessories: [], tips: [] };
  const temp = weather.temperature;
  
  if (temp < 5) {
    advice.layers = ['Heavy coat', 'Sweater', 'Thermal layers'];
    advice.accessories = ['Scarf', 'Gloves', 'Winter hat'];
    advice.tips = ['Dress in layers', 'Wear warm colors'];
  } else if (temp < 15) {
    advice.layers = ['Jacket', 'Long sleeve top', 'Pants'];
    advice.accessories = ['Light scarf'];
    advice.tips = ['Layering is key'];
  } else if (temp < 25) {
    advice.layers = ['T-shirt', 'Light pants'];
    advice.accessories = ['Sunglasses'];
    advice.tips = ['Comfortable fabrics'];
  } else {
    advice.layers = ['Light top', 'Shorts'];
    advice.accessories = ['Sunglasses', 'Sun hat'];
    advice.tips = ['Stay cool', 'Light colors'];
  }
  
  if (weather.condition.includes('rain')) {
    advice.accessories.push('Umbrella', 'Waterproof jacket');
  }
  
  return advice;
}

export default router;

// module.exports = router;
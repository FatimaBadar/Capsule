// server/services/AIService.js
import axios from 'axios';
import fs from 'fs';

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const FASHION_CLIP_API = 'https://api-inference.huggingface.co/models/patrickjohncyh/fashion-clip';
const BLIP2_API = 'https://api-inference.huggingface.co/models/Salesforce/blip2-opt-2.7b';

class AIService {
  // Query Hugging Face API with retry logic
  async queryHuggingFace(url, imageBuffer, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.post(url, imageBuffer, {
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/octet-stream'
          },
          timeout: 60000,
        });
        return response.data;
      } catch (error) {
        // If model is loading, wait and retry
        if (error.response?.status === 503 && i < retries - 1) {
          console.log(`Model loading, retry ${i + 1}/${retries} in 10 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          continue;
        }
        console.error(`HF API Error (attempt ${i + 1}):`, error.message);
        if (i === retries - 1) throw error;
      }
    }
  }

  // Get Fashion-CLIP embedding for an image
  async getImageEmbedding(imagePath) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await this.queryHuggingFace(FASHION_CLIP_API, imageBuffer);
      
      // Fashion-CLIP returns embedding array
      return Array.isArray(response) ? response : (response.embeddings || response[0] || []);
    } catch (error) {
      console.error('Fashion-CLIP embedding error:', error.message);
      throw new Error('Failed to generate image embedding');
    }
  }

  // Get clothing description using BLIP-2
  async analyzeClothing(imagePath) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const response = await this.queryHuggingFace(BLIP2_API, imageBuffer);
      
      // BLIP-2 returns array with generated_text
      if (Array.isArray(response) && response.length > 0) {
        return response[0].generated_text || 'Unable to analyze';
      }
      return 'Unable to analyze';
    } catch (error) {
      console.error('BLIP-2 analysis error:', error.message);
      return 'AI analysis unavailable';
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Find similar items based on embedding
  findSimilarItems(targetEmbedding, allItems, topK = 5) {
    const similarities = allItems
      .filter(item => item.embedding && item.embedding.length > 0)
      .map(item => ({
        item,
        similarity: this.cosineSimilarity(targetEmbedding, item.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return similarities;
  }

  // Auto-suggest category from AI description
  suggestCategory(description) {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('shirt') || lowerDesc.includes('blouse') || lowerDesc.includes('top')) {
      return 'shirt';
    } else if (lowerDesc.includes('pants') || lowerDesc.includes('trousers')) {
      return 'pants';
    } else if (lowerDesc.includes('jeans')) {
      return 'jeans';
    } else if (lowerDesc.includes('dress')) {
      return 'dress';
    } else if (lowerDesc.includes('jacket') || lowerDesc.includes('coat')) {
      return 'jacket';
    } else if (lowerDesc.includes('sweater') || lowerDesc.includes('hoodie')) {
      return 'sweater';
    } else if (lowerDesc.includes('shorts')) {
      return 'shorts';
    } else if (lowerDesc.includes('skirt')) {
      return 'skirt';
    }
    
    return 'other';
  }

  // Extract dominant color from description (simple keyword matching)
  extractColor(description) {
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'grey', 
                    'pink', 'purple', 'orange', 'brown', 'beige', 'navy', 'teal'];
    const lowerDesc = description.toLowerCase();
    
    for (const color of colors) {
      if (lowerDesc.includes(color)) {
        return color;
      }
    }
    return 'unknown';
  }
}

export default AIService;

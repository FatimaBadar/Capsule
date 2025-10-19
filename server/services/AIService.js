import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

// Parse JSON
async function cleanAndParseJSON(responseText) {
  try {
    const clean = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/,\s*}/g, "}") // remove trailing commas in objects
      .replace(/,\s*]/g, "]") // remove trailing commas in arrays
      .replace(/(\r\n|\n|\r)/gm, "") // strip newlines
      .trim();

    const parsed = JSON.parse(clean);

    //remove duplicates in roles/features
    const { title, category, color, fabric, seasonType, style, occasion, description } = parsed;
    return { title, category, color, fabric, seasonType, style, occasion, description };
  } catch (error) {
    console.error("Failed to parse JSON:", error);

    // repairing by closing braces/brackets
    let repaired = responseText;
    const openCurly = (repaired.match(/{/g) || []).length;
    const closeCurly = (repaired.match(/}/g) || []).length;
    const openSquare = (repaired.match(/\[/g) || []).length;
    const closeSquare = (repaired.match(/]/g) || []).length;

    repaired += "}".repeat(openCurly - closeCurly);
    repaired += "]".repeat(openSquare - closeSquare);

    const parsed = JSON.parse(repaired);
    const { title, category, color, fabric, seasonType, style, occasion, description } = parsed;
    return { title, category, color, fabric, seasonType, style, occasion, description };
  }
}

export const describeClothing = async (imageURL) => {
  try {
    const prompt = `You are a professional fashion analyst. Analyze the clothing item in this image and extract detailed metadata for a wardrobe management system.

Image URL: "${imageURL}"

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON object (no text, no markdown, no explanations)
2. Do not include code fences or any other text
3. Always close all brackets and braces properly
4. If information is unclear, make reasonable assumptions based on visual cues
5. Be specific and accurate in your analysis

ANALYSIS REQUIREMENTS:
- Identify the exact type of clothing item
- Determine primary and secondary colors
- Assess fabric/material type if visible
- Determine appropriate seasons for wearing
- Note any distinctive style features (fit, pattern, design elements)
- Consider formality level and occasion appropriateness

Return ONLY this JSON structure:
{
  "title": "descriptive name (e.g., 'Navy Blue Wool Blazer')",
  "category": "clothing type (jeans, pants, skirt, coat, shirt, jacket, dress, sweater, shorts, t-shirt, hoodie, suit, blouse, shoes, accessories, other)",
  "color": "primary color(s) (e.g., 'navy blue', 'black and white striped', 'red')",
  "fabric": "material type (cotton, wool, denim, silk, polyester, leather, etc.)",
  "seasonType": "appropriate season (summer, winter, spring, fall, all-season)",
  "style": "style category (casual, formal, business, athletic, streetwear, vintage, minimalist, etc.)",
  "occasion": "suitable occasions (work, party, casual, formal, athletic, beach, etc.)",
  "description": "detailed description including fit, style, notable features, and overall appearance"
}`;

    const chatCompletion = await client.chatCompletion({
      provider: "cerebras",
      model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    // return chatCompletion.choices[0].message.content;
    const response = chatCompletion.choices[0].message.content;

    if (response) {
      console.log("Raw AI Response:", response);
      const parsed = await cleanAndParseJSON(response);
      if (parsed) {
        console.log("Parsed JSON:", parsed);
        return parsed;
      }
    }
    console.log("No JSON found, using fallback");
    return null;
  } catch (err) {
    console.error("Image-to-text failed:", err);
    throw new Error("AI image-to-text failed.");
  }
};

export const analyzeClothingWithAI = async (imageBuffer) => {
  try {
    const aiDescription = await describeClothing(imageBuffer);

    console.log("AI Description:", aiDescription);

    // Return structured metadata (placeholder for now)
    return {
      title: aiDescription.title || "Unknown Item",
      category: aiDescription.category || "unknown",
      color: aiDescription.color || "unknown",
      fabric: aiDescription.fabric || "unknown",
      seasonType: aiDescription.seasonType || "unknown",
      style: aiDescription.style || "casual",
      occasion: aiDescription.occasion || "general",
      description: aiDescription.description || "No description available",
    };
  } catch (err) {
    console.error("AI Analysis failed:", err);
    throw new Error("AI analysis failed.");
  }
};

// Enhanced outfit generation with weather and preferences
export const generateOutfit = async (preferences) => {
  try {
    const { style, color, weather, occasion, userClothes } = preferences;
    
    const prompt = `Generate a complete outfit suggestion based on these preferences:
    - Style: ${style}
    - Color preference: ${color}
    - Weather: ${weather}
    - Occasion: ${occasion}
    - Available clothes: ${userClothes ? userClothes.map(item => `${item.title} (${item.color}, ${item.category})`).join(', ') : 'No specific items'}
    
    Return a JSON object with outfit suggestions including:
    - outfitTitle: Creative name for the outfit
    - items: Array of clothing items with name, category, color, and description
    - weatherAppropriate: Boolean indicating if suitable for current weather
    - occasionAppropriate: Boolean indicating if suitable for the occasion
    - styleRating: Rating from 1-5 for style match
    - description: Brief description of the outfit`;

    const chatCompletion = await client.chatCompletion({
      provider: "cerebras",
      model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = chatCompletion.choices[0].message.content;
    
    if (response) {
      const parsed = await cleanAndParseJSON(response);
      return parsed;
    }
    
    // Fallback outfit generation
    return generateFallbackOutfit(preferences);
  } catch (err) {
    console.error("Outfit generation failed:", err);
    return generateFallbackOutfit(preferences);
  }
};

// Fallback outfit generation when AI fails
const generateFallbackOutfit = (preferences) => {
  const { style, color, weather, occasion } = preferences;
  
  const outfitTemplates = {
    casual: {
      title: "Casual Day Outfit",
      items: [
        { name: "Basic T-Shirt", category: "t-shirt", color: color || "white", description: "Comfortable cotton tee" },
        { name: "Jeans", category: "jeans", color: "blue", description: "Classic denim jeans" },
        { name: "Sneakers", category: "shoes", color: "white", description: "Comfortable walking shoes" }
      ],
      description: "A relaxed and comfortable outfit perfect for casual activities"
    },
    business: {
      title: "Professional Look",
      items: [
        { name: "Dress Shirt", category: "shirt", color: color || "white", description: "Crisp professional shirt" },
        { name: "Dress Pants", category: "pants", color: "black", description: "Tailored dress pants" },
        { name: "Dress Shoes", category: "shoes", color: "black", description: "Polished leather shoes" }
      ],
      description: "A polished and professional outfit suitable for business settings"
    },
    formal: {
      title: "Formal Attire",
      items: [
        { name: "Suit Jacket", category: "jacket", color: color || "black", description: "Elegant suit jacket" },
        { name: "Dress Pants", category: "pants", color: color || "black", description: "Matching dress pants" },
        { name: "Dress Shoes", category: "shoes", color: "black", description: "Formal leather shoes" }
      ],
      description: "An elegant formal outfit for special occasions"
    },
    athletic: {
      title: "Active Wear",
      items: [
        { name: "Performance Tee", category: "t-shirt", color: color || "black", description: "Moisture-wicking athletic shirt" },
        { name: "Athletic Shorts", category: "shorts", color: "black", description: "Comfortable workout shorts" },
        { name: "Running Shoes", category: "shoes", color: "white", description: "Supportive athletic shoes" }
      ],
      description: "Performance-focused outfit for athletic activities"
    }
  };

  const template = outfitTemplates[style] || outfitTemplates.casual;
  
  return {
    outfitTitle: template.title,
    items: template.items,
    weatherAppropriate: true,
    occasionAppropriate: true,
    styleRating: 4,
    description: template.description
  };
};

// Generate multiple outfit suggestions
export const generateMultipleOutfits = async (preferences, count = 3) => {
  try {
    const outfits = [];
    
    for (let i = 0; i < count; i++) {
      const outfit = await generateOutfit(preferences);
      outfits.push({
        ...outfit,
        id: `outfit_${Date.now()}_${i}`,
        createdAt: new Date().toISOString()
      });
    }
    
    return outfits;
  } catch (err) {
    console.error("Multiple outfit generation failed:", err);
    throw new Error("Failed to generate outfit suggestions");
  }
};

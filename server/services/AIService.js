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
    const { title, category, color, fabric, seasonType, description } = parsed;
    return { title, category, color, fabric, seasonType, description };
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
    const { title, category, color, fabric, seasonType, description } = parsed;
    return { title, category, color, fabric, seasonType, description };
  }
}

export const describeClothing = async (imageURL) => {
  try {
    const prompt = `
You are a fashion assistant. Analyze and describe the clothing item in this image and extract structured metadata.
Image URL: "${imageURL}"

Output Rules:
1. Return ONLY one valid JSON object (no text, no markdown, no comments).
2. Do not include code fences or explanations.
3. Always close all brackets and braces properly.
4. If information is missing, use an empty string "" or empty array [].
5. JSON must include fields: title, category, color, fabric, seasonType, description.
6. The description field should be a detailed one sentence, including: 
- Type of clothing (e.g., shirt, jacket, pants) 
- Primary color(s) 
- Material/fabric if identifiable 
- Season suitability (summer, winter, all-season) 


Return ONLY a JSON object with these fields:
- title: a short descriptive title (e.g., "Blue Winter Coat")
- category: clothing type ("jeans", "pants", "skirt", "coat", "shirt", "jacket", "dress", "sweater", "shorts", "t-shirt", "hoodie", "suit", "blouse", "other", etc.)
- color: primary color(s)
- material: main fabric/material if identifiable
- seasonType: suitable season ("summer", "winter", "all-season", "spring", "fall")

JSON Structure (must match exactly):
{
  "title": "short descriptive title",
  "category": "clothing type",
  "color": "primary color(s)",
  "fabric": "main material/fabric",
  "seasonType": "suitable season",
  "description": "detailed description including style, fit, and any notable features"
}
`;

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
      description: aiDescription.description || "No description available",
    };
  } catch (err) {
    console.error("AI Analysis failed:", err);
    throw new Error("AI analysis failed.");
  }
};

export const generateOutfit = async (imageDescription) => {
  try {
    // const prompt = await describeClothing(imageBuffer);

    const result = await client.textToImage({
      provider: "fal-ai",
      model: "tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator",
      inputs: imageDescription.description,
      parameters: { num_inference_steps: 5 },
    });

    return result;
  } catch (err) {
    console.error("Outfit generation failed:", err);
    throw new Error("AI outfit generation failed.");
  }
};

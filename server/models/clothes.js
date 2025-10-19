// server/models/clothes.js
import mongoose from 'mongoose';

const clothesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  title: { type: String, required: true }, // Keep for backward compatibility
  description: { type: String, default: "" },
  fabric: { type: String, default: "" },
  category: { 
    type: [String], 
    required: true,
    enum: ['top', 'bottom', 'shoes', 'accessories', 'shirt', 'pants', 'jeans', 'skirt', 'coat', 'jacket', 'dress', 't-shirt', 'shorts', 'sweater', 'hoodie', 'blouse', 'suit', 'other']
  },
  seasonType: { 
    type: [String], 
    default: [],
    enum: ['summer', 'winter', 'spring', 'fall', 'autumn', 'all-season']
  },
  color: { 
    type: String, 
    required: true 
  },
  style: { type: [String] }, // casual, formal, sporty, etc.
  occasion: { type: [String] }, // work, party, casual, etc.
  weather: { type: String }, // summer, winter, spring, fall
  tags: [String],
  user: { type: String, default: "default" }, // Keep for backward compatibility
  imageUrl: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Clothes = mongoose.model('Clothes', clothesSchema);

export default Clothes;
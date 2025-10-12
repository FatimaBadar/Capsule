// server/models/clothes.js
import mongoose from 'mongoose';

const clothesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  fabric: { type: String, default: "" },
  category: { type: String, default: "" },
  seasonType: { type: String, default: "" },
  color: { type: String, default: "" },
  user: { type: String, default: "default" },
  imageUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Clothes = mongoose.model('Clothes', clothesSchema);

export default Clothes;
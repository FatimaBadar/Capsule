// server/models/clothes.js
import mongoose from 'mongoose';

const clothesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['shirt', 'pants', 'jeans', 'skirt', 'coat', 'jacket', 'dress', 
           't-shirt', 'shorts', 'sweater', 'hoodie', 'blouse', 'suit', 'other', 'unknown'],
    lowercase: true,
    default: 'other'
  },
  fabric: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  seasonType: {
    type: String,
    enum: ['summer', 'winter', 'spring', 'autumn', 'all'],
    default: 'all',
    lowercase: true
  },
  imageFile: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  // AI-generated fields
  aiDescription: {
    type: String
  },
  embedding: {
    type: [Number],
    default: []
  },
  suggestedCategory: {
    type: String
  },
  // Metadata
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastWorn: {
    type: Date
  },
  wearCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
clothesSchema.index({ user: 1, category: 1 });
clothesSchema.index({ user: 1, seasonType: 1 });
clothesSchema.index({ uploadedAt: -1 });

// Virtual for image URL
clothesSchema.virtual('imageUrl').get(function() {
  return `/uploads/${this.imageFile}`;
});

// Ensure virtuals are included in JSON
clothesSchema.set('toJSON', { virtuals: true });
clothesSchema.set('toObject', { virtuals: true });

const Clothes = mongoose.model('Clothes', clothesSchema);

export default Clothes;
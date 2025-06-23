const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['Layihə', 'Texnologiya', 'Dizayn', 'Şəxsi'],
    default: 'Layihə'
  },
  author: {
    type: String,
    default: 'Admin',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
newsSchema.index({ date: -1 });
newsSchema.index({ category: 1 });

module.exports = mongoose.model('News', newsSchema);
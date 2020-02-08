const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  writtenBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  writtenFor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  writtenAt: {
    type: Date,
    default: Date.now()
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  helpfulCount: {
    type: Number,
    required: true,
    default: 0
  },
  markedAsHelpful: [
    {
      user: { type: String, required: true },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

module.exports = Review = mongoose.model('review', ReviewSchema);

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const reviewSchema = new mongoose.Schema
(
  {
    userID:
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
      },

    comment:
      {
        type: String,
        required: true
      },

    rating:
      {
        type: Number,
        required: true
      }
  }
)

reviewSchema.plugin(uniqueValidator);

module.exports = mongoose.model
(
  'Review',
  reviewSchema
);

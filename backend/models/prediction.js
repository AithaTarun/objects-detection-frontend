const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema
(
  {
    userID:
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },

    imageURL:
      {
        type: String,
        required: true
      },

    predictions:
      {
        type:
          [
            {
              bbox:
                {
                  type: [Number],
                  required: true,
                  default: []
                },
              class:
                {
                  type: String,
                  required: true
                },
              score:
                {
                  type: Number
                }
            }
          ],

        default: []
      },

    imageName:
      {
        type: String,
        required: true
      }
  }
);

module.exports = mongoose.model
(
  'Prediction',
  predictionSchema
);

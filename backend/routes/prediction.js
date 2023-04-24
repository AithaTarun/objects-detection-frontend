const express = require('express');

const router = express.Router();

const predictionController = require('../controllers/prediction');

const multer = require("multer");

let multerStorage = multer();

const checkAuthentication = require('../middleware/check-authentication');

router.post
(
  '/upload',

  checkAuthentication,

  multerStorage.single('image'),

  predictionController.uploadPrediction
);

router.get
(
  '/fetchAll',

  checkAuthentication,

  predictionController.fetchPredictions
);

router.delete
(
  '/delete',

  checkAuthentication,

  predictionController.deletePrediction,
);

module.exports = router;

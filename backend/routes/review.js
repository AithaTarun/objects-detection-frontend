const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/review');
const checkAuthentication = require("../middleware/check-authentication");

router.post
(
  '/save',
  checkAuthentication,
  reviewController.save,
);

module.exports = router;

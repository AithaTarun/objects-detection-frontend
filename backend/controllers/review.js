const Review = require('../models/review');

const jwt = require('jsonwebtoken');

exports.save = async (request, response, next)=>
{
  const token = request.token;
  const decodedToken = jwt.decode(token);

  const review = await Review
  (
    {
      userID: decodedToken.userId,
      comment: request.body.comment,
      rating: request.body.rating
    }
  );

  try
  {
    const result = await review.save();

    if (result)
    {
      return response.status(200).send
      (
        {
          message: 'Review Submitted Successfully'
        }
      )
    }
    else
    {
      throw new Error("Error while saving review");
    }
  }
  catch (error)
  {
    console.log(error);

    return response.status(500).send
    (
      {
        message: 'User Already Submitted Review'
      }
    )
  }
}

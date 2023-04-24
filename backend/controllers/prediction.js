const Prediction = require('../models/prediction');

const jwt = require('jsonwebtoken');

const httpRequest = require('request');

exports.uploadPrediction = async (request, response, next)=>
{
  const token = request.token;
  const decodedToken = jwt.decode(token);

  const options =
    {
    method: 'POST',
    url: 'https://postput.p.rapidapi.com/',
    headers:
      {
        'content-type': 'multipart/form-data',
        'x-rapidapi-host': 'postput.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        useQueryString: true
      },
    formData:
      {
      'file':
        {
          value: request.file.buffer,
          options: {filename: request.file.originalname, contentType: 'application/octet-stream'}
        }
      }
    };

  httpRequest
  (
    options,
    async (error, res, body) =>
    {
      if (error)
      {
        console.log(error);

        return response.status(500).send
        (
          {
            message: 'Error while uploading image to cloud'
          }
        )
      }

      try
      {
        body = JSON.parse(body);

        const prediction = new Prediction
        (
          {
            userID: decodedToken.userId,
            imageURL: body[0].urls[0],
            predictions: JSON.parse(request.body.predictions),
            imageName: request.file.originalname
          }
        );

        const result = await prediction.save();

        return response.status(201).send
        (
          {
            message: "Prediction Uploaded",
            result
          }
        )
      }
      catch (error)
      {
        console.log(error);

        return response.status(500).send
        (
          {
            message: 'Error while storing predictions'
          }
        )
      }
    }
  );
}

exports.fetchPredictions = async (request, response, next)=>
{
  const token = request.token;
  const decodedToken = jwt.decode(token);

  try
  {
    const predictions = await Prediction.find
    (
      {
        userID: decodedToken.userId,
      }
    );

    if (predictions)
    {
      return response.status(200).send
      (
        {
          message: 'Fetched predictions successfully',
          predictions
        }
      );
    }
  }
  catch (error)
  {
    console.log(error)

    return response.status(500).send
    (
      {
        message: 'Error while fetching predictions'
      }
    );
  }
}

exports.deletePrediction = async (request, response, next)=>
{
  try
  {
    const result = await Prediction.deleteOne
    (
      {
        _id: request.body.id
      }
    );

    if (result.deletedCount === 1)
    {
      return response.status(201).send
      (
        {
          message: 'Deleted Prediction Successfully'
        }
      );
    }
    else
    {
      throw new Error("No Prediction Found");
    }
  }
  catch (error)
  {
    console.log(error)

    return response.status(500).send
    (
      {
        message: 'Error while deleting prediction'
      }
    );
  }
}

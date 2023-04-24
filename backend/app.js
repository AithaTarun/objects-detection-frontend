const express = require('express');

const app = express();

const mongoose = require('mongoose');

const connectionURL = process.env.MONGO_DB_URL

const databaseName = 'objects-detection-database';

mongoose.connect
(
  connectionURL+"/"+databaseName,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then
(
  ()=>
  {
    console.log("Connected to database")
  }
).catch
(
  (e)=>
  {
    console.log("Connection to database failed", e);
  }
);

app.use
(
  express.json()
);

try
{
  app.use //To handle CORS error.
    (
      (request,response,next)=>
      {
        response.setHeader
        (
          'Access-Control-Allow-Origin',
          '*'
        );

        response.setHeader
        (
          'Access-Control-Allow-Origin', process.env.FRONT_END_URL
        );

        response.setHeader
        (
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );

        response.setHeader
        (
          'Access-Control-Allow-Methods',
          'GET, POST, PATCH, DELETE, OPTIONS, PUT'
        );

        response.setHeader
        (
          'Access-Control-Allow-Credentials',
          'true'
        )

        next();
      }
    );
}
catch (e)
{
  console.log("Error occurred :", e)
}

const userRoutes = require('./routes/user');
app.use("/api/user", userRoutes);

const predictionRoutes = require('./routes/prediction');
app.use("/api/prediction", predictionRoutes);

const reviewRoutes = require('./routes/review');
app.use("/api/review", reviewRoutes);

module.exports = app;

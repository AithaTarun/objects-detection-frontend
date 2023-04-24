const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require("jsonwebtoken");

exports.createUser = async (request,response,next)=>
{
  try
  {
    const hash = await bcrypt.hash(request.body.password,10);

    const user = new User
    (
      {
        username : request.body.username,
        password : hash
      }
    );

    const result = await user.save();

    return response.status(201).send
    (
      {
        message : 'User created',
        result :
          {
            id : result._id,
            username : result.username,
          }
      }
    );

  }
  catch (error)
  {
    console.log(error);

    let errorMessages = [];

    Object.entries(error.errors)
      .map(
        err =>
        {
          console.log(err[0]);
          errorMessages.push(err[0])
        }
      );

    return response.status(500).send
    (
      {
        message : errorMessages
      }
    );
  }
};

exports.loginUser = async (request,response,next)=>
{
  try
  {
    const user = await User.findOne
    (
      {
        username: request.body.username
      }
    );

    // Username not found
    if (user === null)
    {
      throw new Error("Username doesn't exits");
    }

    // Found user but wrong password
    const result = await bcrypt.compare(request.body.password, user.password);
    if (!result)
    {
      throw new Error("Wrong username and password combination");
    }

    // Found user with correct password
    const token = jwt.sign
    (
      {
        userId: user._id,
        username : user.username
      },
      'secretKey',
      {
        //To configure token.
        expiresIn: request.body.remember ? '24h' : '1h'
      }
    );

    return response.status(200).send
    (
      {
        token: token,
        expiresIn: request.body.remember ? 86400 : 3600 //This token expires in 3600 seconds = 1 hour
      }
    );
  }
  catch(error)
  {
    console.log(error);

    return response.status(401).send
    (
      {
        message : error.message
      }
    );
  }
};

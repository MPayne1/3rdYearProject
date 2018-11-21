// contains some middlewares
const jwt = require('jsonwebtoken');

// function to check the users token
function checkTokenSetUser(req, res, next) {
  // get token from req
  const authHeader = req.get('Authorization');
  if(authHeader) {
    const token = authHeader.split(' ')[1];
    if(token) {
      // verify token and set the user on the request
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) console.log(err);
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }

}

module.exports = {
  checkTokenSetUser,
};

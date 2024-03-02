const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // if token not provided
  if (!token) {
    return res.status(401).send("ERR_AUTH_TOKEN_REQUIRED");
  }

  // verification of token
  try {
    const decodedToken = await jwt.verify(token, TOKEN_KEY);
    req.currentUser = decodedToken;
  } catch (error) {
    return res.status(401).send("ERR_INVALID_TOKEN");
  }

  // if the token is valid proceed with request
  return next();
};

const verifyAdmin = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // if token not provided
  if (!token) {
    return res.status(401).send("ERR_AUTH_TOKEN_REQUIRED");
  }

  // verification of token
  try {
    const decodedToken = await jwt.verify(token, TOKEN_KEY);
    console.log(decodedToken);
    if (!decodedToken.isAdmin) {
      return res.status(401).send("ERR_UNAUTHORIZED_ACCESS");
    }
    req.currentUser = decodedToken;
  } catch (error) {
    return res.status(401).send("ERR_INVALID_TOKEN");
  }

  // if the token is valid proceed with request
  return next();
};

module.exports = { verifyToken, verifyAdmin };

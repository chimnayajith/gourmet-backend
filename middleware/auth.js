const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = async (req , res , next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // if token not provided
    if (!token){
        return res.status(401).send("Authentication token required.");
    }

    // verification of token
    try {
        const decodedToken = await jwt.verify(token , TOKEN_KEY);
        req.currentUser = decodedToken;
    } catch (error) {
        return res.status(401).send("Invalid token provided.")
    }

    // if the token is valid proceed with request
    return next();
};

module.exports = verifyToken;
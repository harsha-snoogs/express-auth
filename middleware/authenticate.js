const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken || bearerToken.length < 1) {
      res.status(401).json({
        message: "Token missing",
      });
      return;
    }
    const [scheme, token] = bearerToken.split(" ");

    if (!token || scheme != "Bearer") {
      res.status(401).json({
        message: "Token missing",
      });
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();

  } catch (error) {
    res.status(500).json({
      message: "Internal server error - code 1",
    });
  }
}

module.exports = authenticate;

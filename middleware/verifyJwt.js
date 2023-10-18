const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = process.env;

// Middleware to verify JWT token
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify user ownership or admin rights
const verifyOwnershipOrAdmin = (req, res, next) => {
  verifyJwt(req, res, () => {
    const userId = req.user.id;
    if (userId === req?.params?.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized: Insufficient permissions" });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized: Insufficient permissions" });
    }
  });
};

module.exports = { verifyJwt, verifyOwnershipOrAdmin, verifyAdmin };
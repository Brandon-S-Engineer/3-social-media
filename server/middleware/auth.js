import jwt from 'jsonwebtoken';

// Middleware to verify JWT in the Authorization header
export const verifyToken = async (req, res, next) => {
  try {
    // Retrieve token from the Authorization header
    let token = req.header('Authorization');

    // If no token found, deny access
    if (!token) {
      return res.status(403).send('Access Denied');
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token using the secret and attach user data to the request
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token; // Get token from HTTP-Only Cookie
    console.log(token);

    if (!token) return res.status(401).json({ message: "Access denied" });

    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = verified; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

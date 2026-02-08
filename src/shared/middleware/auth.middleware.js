import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // DEBUG (temporary, keep for now)
  console.log("Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing or malformed Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verify error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

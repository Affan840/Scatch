import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email }).select("-password");
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default isLoggedIn;

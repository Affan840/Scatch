import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  res.cookie("hello", "world");
  console.log("Cookies received:", req.cookies); // Check if cookies exist
  const token = req.cookies.token;
  console.log("Token from cookie:", token); // Check if token exists

  if (!token) {
    req.user = null;
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      req.user = null;
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    req.user = null;
    res.clearCookie("token", { path: "/" }); // Clear expired token
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



export default isLoggedIn;

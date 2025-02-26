import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("Received Token:", token); // Debugging log

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

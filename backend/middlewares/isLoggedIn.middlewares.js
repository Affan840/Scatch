import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email }).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default isLoggedIn;

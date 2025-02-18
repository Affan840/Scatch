import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) {
    console.log( "Please login to continue");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email }).select("-password");
    req.user = user;
    next();
  } catch (error) {
    return res.redirect("/");
  }
};

export default isLoggedIn;

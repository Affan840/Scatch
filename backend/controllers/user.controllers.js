import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(401).send("Email already exists");

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return res.send(err.message);
      else {
        let user = await User.create({
          email,
          fullname,
          password: hash,
        });
        let token = generateToken(user);
        res.cookie("token", token, {
          httpOnly: true, // Prevents JavaScript access
          secure: process.env.NODE_ENV === "production", // Set true only in production
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Use Lax for development
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: "/",
        });
        res.status(200).json({ message: "Registration successful", user });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      console.log("User not found!");
      return res.status(401).send("Email or password is incorrect");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log("Error comparing passwords:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (!result) {
        console.log("Password incorrect!");
        return res.status(401).send("Email or password is incorrect");
      }

      let token = generateToken(user);
      console.log("cookie set", token);
      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Set true only in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Use Lax for development
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });
      res.status(200).json({ message: "Login successful", user });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const logoutUser = async (req, res) => {
  console.log("Before logout - Cookies:", req.cookies); // Debug: Check cookies before clearing
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
  console.log("After logout - Cookies:", req.cookies); // Debug: Check if cookies are cleared

  req.user = null; // Clear user on backend
  return res.status(200).json({ message: "Logged out successfully" });
};


const updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log("Received cart update request:", cart);
    const user = await User.findByIdAndUpdate(req.user._id, { cart }, { new: true });
    console.log("Cart updated successfully:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

const fetchCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export { registerUser, loginUser, logoutUser, updateCart, fetchCart };

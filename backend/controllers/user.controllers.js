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
        res.cookie("token", token);
        res.send(user);
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
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 3600000,
        path: "/",
      });
      res.status(200).json(user);
    });
  } catch (error) {
    console.log("Server error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const updateCart = async (req, res) => {
  try {
    const { userId, cart } = req.body;
    console.log("Received cart update request:", cart);
    const user = await User.findByIdAndUpdate(userId, { cart }, { new: true });
    console.log("Cart updated successfully:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

const fetchCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export { registerUser, loginUser, logoutUser, updateCart, fetchCart };

import { Owner } from "../models/owner.model.js";
import bcrypt from "bcrypt"

const createOwner = async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: "Route disabled in production" });
    }
  
    try {
      const { fullname, email, password } = req.body;
      bcrypt.hash(password, 10, async (err, hash) => {
        const owner = await Owner.create({ fullname, email, password: hash });
        res.status(201).json(owner);
      })
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request body:", req.body);
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        bcrypt.compare(password, owner.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error comparing passwords" });
            }
            if (!result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            res.status(200).json(owner);
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }

export {
    createOwner,
    loginOwner
}
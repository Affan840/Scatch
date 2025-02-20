import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDB from "./config/mongoose.connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes imports
import ownersRoute from "./routes/owners.routes.js";
import usersRoute from "./routes/users.routes.js";
import productsRoute from "./routes/products.routes.js";
import authRoute from "./routes/index.js";
import ordersRoute from "./routes/orders.routes.js";
import { Product } from "./models/product.model.js";

app.use("/shop",authRoute);
app.use("/owners", ownersRoute);
app.use("/users", usersRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error: ", error);
  });

export default app;
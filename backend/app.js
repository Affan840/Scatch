import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import connectDB from "./config/mongoose.connection.js";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());

// Routes imports
import ownersRoute from "./routes/owners.routes.js";
import usersRoute from "./routes/users.routes.js";
import productsRoute from "./routes/products.routes.js";
import authRoute from "./routes/index.js";
import ordersRoute from "./routes/orders.routes.js";

app.use("/shop", authRoute);
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

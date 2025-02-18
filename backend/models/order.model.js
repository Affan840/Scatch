import mongoose from "mongoose";
import { Counter } from "./counter.model.js";
import { User } from "./user.model.js";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "COD"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "orderNumber" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      this.orderNumber = counter.seq;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

orderSchema.post("save", async function (doc, next) {
  try {
    await User.findByIdAndUpdate(doc.user, {
      $push: { orders: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});

export const Order = mongoose.model("Order", orderSchema);

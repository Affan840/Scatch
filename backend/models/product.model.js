import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    image: Buffer,
    name: String,
    price: Number,
    discount: {
      type: Number,
      default: 0,
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

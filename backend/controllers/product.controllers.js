import { Product } from "../models/product.model.js";


const createProduct = async (req, res) => {
   try {
     const { name, discount, price,bgcolor,panelcolor,textcolor  } = req.body;
     const image = req.file.buffer;
     const product = await Product.create({
       name,
       price,
       discount,
       image,
       bgcolor,
       panelcolor,
       textcolor,
     });
     res.status(201).json(product);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }

};

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    res.status(200).json({ message: "All products deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export { createProduct,deleteAllProducts, deleteProduct };
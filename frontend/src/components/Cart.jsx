"use client";

import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useProducts } from "../contexts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const Cart = ({ isCartOpen, setIsCartOpen }) => {
  const navigate = useNavigate();
  const { cart, productsData, increaseQuantity, decreaseQuantity, clearCart } =
    useProducts();
  const cartItems = Object.keys(cart)
    .map((productId) => {
      const product = productsData.find((p) => p._id === productId);
      return product ? { ...product, quantity: cart[productId] } : null;
    })
    .filter((item) => item !== null);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg flex flex-col z-50"
        >
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center">
                <ShoppingCart className="mr-2" /> Your Cart
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={24} className="cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-auto p-6">
            <AnimatePresence>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button
                        className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 mt-8"
                >
                  Your cart is empty.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold transition cursor-pointer duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-2"
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full bg-red-500 text-white py-3 rounded-md text-lg font-semibold transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={clearCart}
              >
                <Trash2 size={20} className="mr-2 " /> Clear Cart
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useOwner, useProducts, useUser } from "../contexts";
import { ShoppingCart, Trash2, Plus, Minus, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

const Products = () => {
  const { userData } = useUser();
  const {
    productsData,
    setProducts,
    filteredProducts,
    cart,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useProducts();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/products`
        );
        if (response.data.products) {
          console.log(response.data.products);
          setProducts(response.data.products);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center ">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl">{error}</div>;
  }

  return (
    <div className="container mx-auto ml-2 md:px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 md:gap-6 gap-2">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white md:max-w-[320px] max-w-[150px] rounded-lg"
            >
              <div className="relative md:h-56 h-36  bg-gray-200">
                <img
                  className="w-full h-full object-contain"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div className="md:p-4 p-1 md:text-lg text-sm">
                <h3 className=" font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex justify-between items-center">
                  {cart[product._id] ? (
                    <div className="flex items-center w-full justify-between">
                      <button
                        className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-bold p-2 rounded-full transition duration-300 ease-in-out"
                        onClick={() => {
                          userData
                            ? decreaseQuantity(product._id)
                            : navigate("/");
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold">{cart[product._id]}</span>
                      <button
                        className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white font-bold p-2 rounded-full transition duration-300 ease-in-out"
                        onClick={() => {
                          userData
                            ? increaseQuantity(product._id)
                            : navigate("/");
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-blue-400 cursor-pointer hover:bg-blue-500 text-white md:font-bold text-sm md:text-lg py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center w-full justify-center"
                      onClick={() => {
                        if (userData) {
                          addToCart(product._id);
                        } else {
                          navigate("/");
                        }
                      }}
                    >
                      <ShoppingCart className="mr-2 " size={20} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-xl">
          No products available.
        </div>
      )}
    </div>
  );
};

export default Products;

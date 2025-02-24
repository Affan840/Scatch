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
          `${import.meta.env.VITE_BASE_URL}/products`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
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
    );
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
        <div className="grid grid-cols-2  tablet:grid-cols-3 lg:grid-cols-4 sm:gap-4 gap-2 sm:p-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                backgroundColor: product.bgcolor || "#34212f",
                color: product.textcolor,
              }}
              className="rounded-lg transition-all duration-300 hover:shadow-md flex flex-col group cursor-pointer overflow-hidden"
            >
              <div className="aspect-square  rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-150 group-hover:scale-150"
                />
              </div>
              <div
                className="p-2 sm:text-md text-sm font-light  sm:font-medium"
                style={{
                  backgroundColor: product.panelcolor || "#5f9493",
                }}
              >
                <div className="sm:space-y-2">
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                </div>

                <div className="sm:mt-3 mt-1">
                  {cart[product._id] ? (
                    <div className="flex items-center justify-between rounded-full bg-white p-1">
                      <button
                        onClick={() =>
                          userData
                            ? decreaseQuantity(product._id)
                            : navigate("/")
                        }
                        className="sm:h-8 sm:w-8 h-5 w-5 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors cursor-pointer"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{cart[product._id]}</span>
                      <button
                        onClick={() =>
                          userData
                            ? increaseQuantity(product._id)
                            : navigate("/")
                        }
                        className="sm:h-8 sm:w-8 h-5 w-5 flex items-center justify-center rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        userData ? addToCart(product._id) : navigate("/")
                      }
                      className="w-full flex items-center justify-center gap-2   rounded-full md:py-2  py-1 sm:px-4 transition-colors cursor-pointer bg-white"
                    >
                      <ShoppingCart size={18} />
                      <span className="md:font-medium font-light ">
                        Add to Cart
                      </span>
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

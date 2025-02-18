"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useOwner, useProducts, useUser } from "../contexts"
import { ShoppingCart, Trash2, Plus, Minus, X, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"

const AdminProducts = () => {
  const { ownerData } = useOwner()
  const { userData } = useUser()
  const { setProducts, filteredProducts, cart, addToCart, increaseQuantity, decreaseQuantity } = useProducts()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`)
        if (response.data && response.data.products) {
          setProducts(response.data.products)
        } else {
          console.error("Unexpected API response format:", response.data)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [setProducts])

  const deleteAllProducts = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/products/delete`)
      setProducts([])
      setError(null)
    } catch (error) {
      console.error("Error deleting products:", error)
      setError("Failed to delete all products. Please try again.")
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/products/${productId}`)
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId))
      setError(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      setError("Failed to delete the product. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 text-xl p-4">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
        {ownerData && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
            onClick={deleteAllProducts}
          >
            <Trash2 className="mr-2" size={20} />
            Delete All
          </button>
        )}
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-36 md:h-64 bg-gray-200">
                <img
                  className="w-full h-full object-contain"
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                />
                {ownerData && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300 ease-in-out"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 sm:mb-4">${product.price.toFixed(2)}</p>
                <div className="flex justify-between items-center">
                  {cart[product._id] ? (
                    <div className="flex items-center w-full justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-1 sm:p-2 rounded-full transition duration-300 ease-in-out"
                        onClick={() => (userData ? decreaseQuantity(product._id) : navigate("/"))}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold text-sm">{cart[product._id]}</span>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-1 sm:p-2 rounded-full transition duration-300 ease-in-out"
                        onClick={() => (userData ? increaseQuantity(product._id) : navigate("/"))}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 sm:py-2 sm:px-4 rounded-full transition duration-300 ease-in-out flex items-center w-full justify-center text-xs sm:text-sm"
                      onClick={() => (userData ? addToCart(product._id) : navigate("/"))}
                    >
                      <ShoppingCart className="mr-1 sm:mr-2" size={16} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-xl">No products available.</div>
      )}
    </div>
  )
}

export default AdminProducts


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
        <div className="text-center text-gray-600 text-xl">No products available.</div>
      )}
    </div>
  )
}

export default AdminProducts


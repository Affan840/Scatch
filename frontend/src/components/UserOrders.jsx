"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "../contexts/UserContext"
import { useNavigate } from "react-router"
import { Loader2, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react"

const UserOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userData } = useUser()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/myorders`, {
          params: { user: userData._id },
        })
        setOrders(response.data.orders)
        setLoading(false)
      } catch (err) {
        setError("Error fetching orders. Please try again later.")
        setLoading(false)
      }
    }
    fetchOrders()
  }, [userData._id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="h-6 w-6" />
        Your Orders
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4 text-gray-600">You have no orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left">Order ID</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Total</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/myorders/${order._id}`)}
                >
                  <td className="py-2 px-4 border-b font-medium">#{order.orderNumber}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UserOrders


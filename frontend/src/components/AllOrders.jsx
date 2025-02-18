"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"

const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`)
        setOrders(response.data.orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, e) => {
    const newStatus = e.target.value
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/status`, {
        orderId,
        status: newStatus,
      })
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)),
      )
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800"
      case "processing":
        return "bg-blue-200 text-blue-800"
      case "shipped":
        return "bg-purple-200 text-purple-800"
      case "delivered":
        return "bg-green-200 text-green-800"
      case "cancelled":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Order History</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Order</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Date</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Payment</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td onClick={() => {navigate(`/owners/dashboard/orders/${order._id}`)}} className="py-4 px-4 text-sm cursor-pointer hover:text-blue-400">#{order.orderNumber || "N/A"}</td>
                  <td className="py-4 px-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        order.paymentMethod === "Stripe" || order.status === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.paymentMethod === "Stripe" || order.status === "Delivered" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="relative">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleStatusChange(order._id, e)}
                        className={`appearance-none w-full px-3 py-1 text-sm rounded border ${getStatusColor(order.status)} pr-8`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium">${order.totalAmount || "0.00"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllOrders


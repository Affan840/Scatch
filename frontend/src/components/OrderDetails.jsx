"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Package, Truck, CreditCard, Calendar, Loader, Loader2 } from "lucide-react";
import { useProducts } from "../contexts";

// Function to convert image buffer to Base64
const convertBufferToBase64 = (buffer) => {
  if (!buffer || !buffer.length) return null;
  return `data:image/png;base64,${btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  )}`;
};

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const {productsData} = useProducts();

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/orders/${orderId}`,
          { withCredentials: true }
        );
        console.log("Full Order Response:", response.data);
        console.log("Products:", productsData);
  
        let orderData = response.data.order || {};
  
        if (orderData.items) {
          orderData.items = orderData.items.map((item) => {
            // Find matching product from productsData
            const matchedProduct = productsData.find(
              (product) => product._id === item.product
            );
  
            return {
              ...item,
              image: matchedProduct?.image || "https://via.placeholder.com/80",
              name: matchedProduct?.name || "Unknown Product", // Fallback name
            };
          });
        }
  
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getOrderDetails();
  }, [orderId, productsData]);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">Order not found</h2>
        <p className="text-gray-600 mt-2">
          The requested order details could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
      {/* Order Details */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-6 w-6" />
            Order Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="text-lg font-semibold">{order.orderNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status || "N/A"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="flex items-center gap-1 mt-1">
                <CreditCard className="h-4 w-4" />
                {order.paymentMethod || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold">${order.totalAmount || "0.00"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Address
          </h3>
          {order.shippingAddress ? (
            <div>
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No shipping address available</p>
          )}
        </div>
      </div>

      {/* Items Ordered */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Items Ordered</h3>
          {order.items && order.items.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={item._id || index} className="py-4 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={`Product ${item.product}`}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-700">${item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No items in this order.</p>
          )}
        </div>
      </div>

      {/* Order Timestamps */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Updated: {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

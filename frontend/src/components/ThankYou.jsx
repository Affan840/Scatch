"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";

const ThankYou = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const location = useLocation();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState(
    location.state?.orderNumber || localStorage.getItem("orderNumber")
  );
  const [totalAmount, setTotalAmount] = useState(
    location.state?.totalAmount ||
      parseFloat(localStorage.getItem("totalAmount"))
  );

  const [orderId, setOrderId] = useState(localStorage.getItem("orderId"));
  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch order details when the component mounts
  useEffect(() => {
    if (!orderId) {
      navigate('/shop');
    }
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/orders/${orderId}`,
          { withCredentials: true }
        );
        setOrderDetails(response.data.order);

        if (response.data?.order.status) {
          const currentStatusIndex = steps.indexOf(response.data?.order.status);
          setCurrentStep(currentStatusIndex >= 0 ? currentStatusIndex : 0);
          localStorage.removeItem("orderNumber");
          localStorage.removeItem("totalAmount");
          localStorage.removeItem("orderId");
        }
        setOrderDetails(response.data?.order);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  if (!orderNumber || !orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="inline-block"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-bold mt-4 mb-2">Thank You!</h1>
          <p className="text-gray-600">Your order has been received</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-semibold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="relative">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center mb-2 ${
                  index <= currentStep ? "text-green-500" : "text-gray-400"
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{step}</span>
              </motion.div>
            ))}
            <div className="absolute left-2 top-0 w-0.5 h-full bg-gray-200 -z-10"></div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Link
            to="/shop"
            className="bg-blue-600 text-white py-2 px-4 rounded-md text-center transition duration-300 ease-in-out hover:bg-blue-700 flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </Link>
          <Link
            to="/myorders"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center transition duration-300 ease-in-out hover:bg-gray-300 flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            View My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;

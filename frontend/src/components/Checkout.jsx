"use client"
import StripeLogo from "../assets/stripe.png"
import { useEffect, useState } from "react"
import { useProducts, useUser } from "../contexts"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import axios from "axios"

const Checkout = () => {
  const navigate = useNavigate()
  const { userData } = useUser()
  const { cart, productsData, clearCart } = useProducts()
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "COD",
  })

  const convertBufferToBase64 = (buffer) => {
    try {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:image/png;base64,${window.btoa(binary)}`;
    } catch (error) {
      console.error("Error converting buffer to base64:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userData) {
      setFormData((prevData) => ({
        ...prevData,
        email: userData.email || "",
        firstName: userData.fullname ? userData.fullname.split(" ")[0] : "",
        lastName: userData.fullname ? userData.fullname.split(" ")[1] || "" : "",
      }))
    } else {
      navigate("/")
    }
  }, [userData, navigate])

  // Validate required fields and email format
  const validateForm = () => {
    let formErrors = {}
    let isValid = true

    if (!formData.email) {
      formErrors.email = "Email is required."
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      formErrors.email = "Invalid email format."
      isValid = false
    }
    if (!formData.firstName) {
      formErrors.firstName = "First name is required."
      isValid = false
    }
    if (!formData.lastName) {
      formErrors.lastName = "Last name is required."
      isValid = false
    }
    if (!formData.address) {
      formErrors.address = "Address is required."
      isValid = false
    }
    if (!formData.city) {
      formErrors.city = "City is required."
      isValid = false
    }
    if (!formData.postalCode) {
      formErrors.postalCode = "Postal code is required."
      isValid = false
    }
    if (!formData.phone) {
      formErrors.phone = "Phone number is required."
      isValid = false
    }

    setErrors(formErrors)
    return isValid
  }

  const cartItems = Object.keys(cart)
    .map((productId) => {
      const product = productsData.find((p) => p._id === productId)
      return product ? { ...product, quantity: cart[productId] } : null
    })
    .filter((item) => item !== null)

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const placeOrder = async () => {
    // Run validations before placing order
    if (!validateForm()) {
      return
    }
    console.log('Placing order...');

    if (formData.paymentMethod === "COD") {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/placeorder`, {
          user: userData._id,
          items: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: totalAmount,
          paymentMethod: formData.paymentMethod,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            phone: formData.phone,
          },
        })
        if (response.status === 200) {
          clearCart();
          localStorage.setItem('orderId', response.data.order._id);
          navigate("/thankyou", { state: { orderNumber: response.data.order.orderNumber, totalAmount } })
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/placeorderstripe`, {
          user: userData._id,
          items: cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: totalAmount,
          paymentMethod: formData.paymentMethod,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            phone: formData.phone,
          },
        })
        if (response.status === 200) {
          clearCart();
          localStorage.setItem("orderNumber", response.data.orderNumber);
          localStorage.setItem("totalAmount", totalAmount);
          localStorage.setItem('orderId', response.data.order);
          window.location.href = response.data.url;
        }
      } catch (error) {
        console.error('Error placing order:', error);
      }
    }
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 bg-white p-8 shadow-lg rounded-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <input
              type="email"
              placeholder="Email or mobile phone number"
              className="w-full p-3 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

            <h2 className="text-2xl font-semibold mb-6">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm mb-2">{errors.firstName}</p>}
            {errors.lastName && <p className="text-red-500 text-sm mb-4">{errors.lastName}</p>}

            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <p className="text-red-500 text-sm mb-4">{errors.address}</p>}

            <div className="grid grid-cols-2 gap-4 mb-1">
              <input
                type="text"
                placeholder="City"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
            {errors.city && <p className="text-red-500 text-sm mb-2">{errors.city}</p>}
            {errors.postalCode && <p className="text-red-500 text-sm mb-4">{errors.postalCode}</p>}

            <input
              type="text"
              placeholder="Phone"
              className="w-full p-3 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-500 text-sm mb-4">{errors.phone}</p>}

            <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <label className="flex items-center space-x-3 mb-4 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  className="form-radio text-blue-600"
                  checked={formData.paymentMethod === "COD"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                />
                <span className="text-gray-900 font-medium">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  className="form-radio text-blue-600"
                  checked={formData.paymentMethod === "Stripe"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "Stripe" })}
                />
                <img src={StripeLogo} alt="stripe" className="h-8 md:h-10" />
              </label>
            </div>

            <button
              onClick={placeOrder}
              className="bg-blue-600 text-white w-full py-4 rounded-md text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Complete Order
            </button>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

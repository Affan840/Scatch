"use client";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload } from "lucide-react";

const CreateProduct = () => {
  const [productImage, setProductImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [panelColor, setPanelColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("image", productImage);
    formData.append("price", productPrice);
    formData.append("discount", discountPrice);
    formData.append("bgcolor", bgColor);
    formData.append("panelcolor", panelColor);
    formData.append("textcolor", textColor);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/products/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/owners/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Product Details</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
              {productImage ? (
                <div className="flex items-center">
                  <Upload className="w-8 h-8 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {productImage.name}
                  </span>
                </div>
              ) : (
                <span className="flex items-center space-x-2">
                  <Upload className="w-6 h-6 text-gray-600" />
                  <span className="font-medium text-gray-600">
                    Drop files here or click to upload
                  </span>
                </span>
              )}
              <input
                type="file"
                name="image"
                className="hidden"
                onChange={(e) => setProductImage(e.target.files[0])}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name
              </label>
              <input
                id="productName"
                name="name"
                type="text"
                placeholder="Product Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Price
              </label>
              <input
                id="productPrice"
                name="price"
                type="text"
                placeholder="Product Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Discount Price
              </label>
              <input
                id="discountPrice"
                name="discount"
                type="text"
                placeholder="Discount Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Panel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="bgColor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Background Color
                </label>
                <input
                  id="bgColor"
                  name="bgcolor"
                  type="text"
                  placeholder="Background Color"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="panelColor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Panel Color
                </label>
                <input
                  id="panelColor"
                  name="panelcolor"
                  type="text"
                  placeholder="Panel Color"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={panelColor}
                  onChange={(e) => setPanelColor(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="textColor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Text Color
                </label>
                <input
                  id="textColor"
                  name="textcolor"
                  type="text"
                  placeholder="Text Color"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

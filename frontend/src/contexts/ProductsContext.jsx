import { useEffect, createContext, useContext, useState } from "react";
import { useUser } from "../contexts";
import axios from "axios";
import { toast } from "react-toastify";

export const ProductsContext = createContext({
  productsData: [],
  setProducts: () => {},
  filteredProducts: [],
  filterProducts: () => {},
  sortProducts: () => {},
  sortBy: null,
  setSortBy: () => {},
  cart: {},
  cartCount: 0,
  cartLoading: false,
  productsLoading: true,
  addToCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
});

export const useProducts = () => useContext(ProductsContext);

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

export const ProductsProvider = ({ children }) => {

  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [cart, setCart] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
const [productsLoading, setProductsLoading] = useState(true);

  const { userData } = useUser();
  
  // Load products when the provider is mounted
  useEffect(() => {
    const loadProducts = async () => {
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
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setProductsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    if (userData) {
      fetchCart();
    }
  }, [userData]);


  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/cart`,
        { withCredentials: true }
      );

      const cartArray = response.data.cart || [];
      const cartObject = cartArray.reduce((acc, item) => {
        const [productId, quantity] = Object.entries(item)[0];
        acc[productId] = quantity;
        return acc;
      }, {});
      setCart(cartObject);
      updateCartCount(cartObject);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart. Please try again later.");
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartInBackend = async (updatedCart) => {
    if (!userData) return;

    // Convert object format {id: quantity, ...} to array format [{id: quantity}, ...]
    const cartArray = Object.entries(updatedCart).map(([id, quantity]) => ({
      [id]: quantity,
    }));

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/updatecart`, {
        cart: cartArray,
      }, { withCredentials: true });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

  const updateCartCount = (updatedCart) => {
    const newCount = Object.values(updatedCart).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setCartCount(newCount);
  };

  const addToCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart, [id]: (prevCart[id] || 0) + 1 };
      updateCartInBackend(updatedCart);
      updateCartCount(updatedCart);
      toast.success("Item added to cart!");
      return updatedCart;
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        [productId]: (prevCart[productId] || 0) + 1,
      };
      updateCartInBackend(updatedCart);
      updateCartCount(updatedCart);
      toast.success("Quantity updated!");
      return updatedCart;
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      let updatedCart;
      if (prevCart[productId] > 1) {
        updatedCart = { ...prevCart, [productId]: prevCart[productId] - 1 };
      } else {
        updatedCart = { ...prevCart };
        delete updatedCart[productId];
      }
      updateCartInBackend(updatedCart);
      updateCartCount(updatedCart);
      toast.success("Quantity updated!");
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart({});
    updateCartInBackend({});
    setCartCount(0);
    toast.success("Cart cleared!");
  };

  const setProducts = (products) => {
    const updatedProducts = products.map((product) => {
      if (product.image && product.image.data) {
        return { ...product, image: convertBufferToBase64(product.image.data) };
      }
      return product;
    });
    setProductsData(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const filterProducts = (category) => {
    setFilterBy(category);
    if (category) {
      setFilteredProducts(
        productsData.filter((product) => product.category === category)
      );
    } else {
      setFilteredProducts(productsData);
    }
  };

  const sortProducts = (order) => {
    setSortBy(order);
    let sorted = [...filteredProducts];
    switch (order) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "low-to-high":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
  };

  return (
    <ProductsContext.Provider
      value={{
        productsData,
        setProducts,
        filteredProducts,
        filterProducts,
        sortProducts,
        cart: userData ? cart : {},
        cartCount: userData ? cartCount : 0,
        cartLoading,
        productsLoading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

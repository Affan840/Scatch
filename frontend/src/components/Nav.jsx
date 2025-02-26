import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProducts, useUser } from "../contexts";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cart from "./Cart";
import axios from "axios";

const Nav = () => {
  const navigate = useNavigate();
  const { userData, setUser } = useUser();
  const location = useLocation();
  const { cartCount } = useProducts();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        { withCredentials: true }
      );
      setUser(null);
      console.log("Logout response:", response);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="w-full flex justify-between fixed top-0 left-0 px-8 py-3 bg-white z-[50]">
        <Link
          to="/"
          className="cursor-pointer text-2xl font-medium text-blue-400"
        >
          Scatch
        </Link>
        <div>
          {userData ? (
            <div className="flex items-center gap-6 mr-6">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={24} />
                <span className="text-black text-lg font-medium px-2 py-1 rounded-md">
                  {cartCount}
                </span>
              </div>
              <div
                ref={dropdownRef}
                className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-md group"
              >
                <div onClick={handleToggle}>
                  <User size={24} />
                </div>

                <div
                  className={`absolute right-0 mt-2 w-40 bg-white shadow-md border transition-all duration-200 ease-in-out transform 
        ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-2"
        } 
        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}
                >
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/myorders");
                        setIsOpen(false); // Close dropdown after navigation
                      }}
                    >
                      My Orders
                    </li>
                    <li
                      className="px-4 py-2 text-red-600 cursor-pointer"
                      onClick={async () => {
                        await handleLogout();
                        setIsOpen(false); // Close dropdown after logout
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            location.pathname === "/" && (
              <div className="flex gap-4">
                <Link
                  to="/auth"
                  className="bg-blue-400 text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
              </div>
            )
          )}
        </div>
      </nav>
      {userData && (
        <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      )}
    </>
  );
};

export default Nav;

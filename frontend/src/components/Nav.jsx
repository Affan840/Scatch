import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProducts, useUser } from "../contexts";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import Cart from "./Cart";
import axios from "axios";

const Nav = () => {
  const navigate = useNavigate();
  const { userData, setUser } = useUser();
  const location = useLocation();
  const { cartCount } = useProducts();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = async () => {
    setUser(null);
   const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
      withCredentials: true,
    });

  console.log(response);
  };

  useEffect(() => {
    
  }, [cartCount]);

  return (
    <>
      <nav className="w-full flex justify-between fixed top-0 left-0 px-8 py-3 bg-white z-[50]">
        <Link
          to="/shop"
          className="cursor-pointer text-2xl font-medium text-blue-400"
        >
          Scatch
        </Link>
        <div>
          {userData ? (
            <div className="flex items-center gap-6">
              <p onClick={() => {navigate(`/myorders`)}} className="text-lg">Hello, {userData.fullname}</p>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={24} />
                <span className="text-black text-lg font-medium px-2 py-1 rounded-md">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-400 text-white px-2 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            location.pathname !== "/" && (
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
      {userData && <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />}
    </>
  );
};

export default Nav;

import { Nav } from "./components";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ProductsProvider, UserProvider, useUser } from "./contexts";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null); // Ensure user is set to null on logout
      } finally {
        setLoading(false);
      }
    };  
    
    

    checkAutoLogin();
  }, []); 

  if (loading) {
    return (
      <div className="flex justify-center w-full items-center h-screen absolute left-0 top-0">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ProductsProvider>
      <Nav />
      <Outlet />
<ToastContainer />
    </ProductsProvider>
  );
};

export default App;

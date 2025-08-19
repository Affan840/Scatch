import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useUser } from "../contexts";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let userData = { email, password };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setUser(response.data);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-8 w-full lg:w-1/2 max-w-md min-w-[350px]">
      <div className="w-full max-w-md space-y-6">
        <h3 className="text-2xl  lg:hidden md:text-5xl font-light text-center lg:text-start">
          welcome to <span className="text-blue-400 font-medium">Scatch</span>
        </h3>
        <h4 className="text-xl sm:text-2xl capitalize font-medium mb-5 text-center lg:text-start">
          Login to your account
        </h4>
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            className="outline-none p-3 rounded-md bg-zinc-100 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="outline-none p-3 rounded-md bg-zinc-100 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer hover:bg-blue-400 rounded-full px-5 py-2 text-lg mt-2 text-white border-none w-full lg:w-max font-semibold bg-blue-400 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

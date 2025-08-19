import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError("");

    const userData = { fullname: fullName, email, password };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error registering user:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Something went wrong. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8 w-full min-h-96 md:w-1/2 max-w-md min-w-[350px]">
      <div className="w-full max-w-md space-y-6">
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-light text-center lg:text-start">
          Welcome to <span className="text-blue-400 font-medium">Scatch</span>
        </h3>
        <h4 className="text-xl sm:text-2xl capitalize font-medium mb-5 text-center lg:text-start">
          Create your account
        </h4>
        {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
        <form noValidate className="flex flex-col gap-4" onSubmit={submitHandler}>
          <div>
            <input
              className="outline-none py-3 px-5 rounded-md bg-zinc-100 w-full"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => {
                setApiError("");
                setFullName(e.target.value)}}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div>
            <input
              className="outline-none py-3 px-5 rounded-md bg-zinc-100 w-full"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setApiError("");
                setEmail(e.target.value)}}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              className="outline-none py-3 px-5 rounded-md bg-zinc-100 w-full"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setApiError("");
                setPassword(e.target.value)}}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer hover:bg-blue-500 rounded-full px-5 py-2 text-lg mt-2 text-white border-none w-full lg:w-max font-semibold bg-blue-400 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating Account..." : "Create My Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

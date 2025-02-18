import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useOwner } from "../contexts";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setOwner} = useOwner();

    const submitHandler = async (e) => {
        e.preventDefault();
        const ownerData = { email, password };
       try {
        console.log(ownerData);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/owners`, ownerData);
        if (response.status === 200) {
          setOwner(response.data);       
          setTimeout(() => {
            navigate("/owners/dashboard");
          }, 1000);
        }
       } catch (error) {
          console.log(error);
       }
    }

  return (

    <div className="w-full h-screen flex md:px-20">
      <div className="w-full flex items-center justify-center h-screen">
        <div className="md:w-2/3 w-full px-12 lg:px-32">
          <h4 className="text-2xl capitalize mb-5">Admin Access</h4>
          <form onSubmit={submitHandler}>
            <input
              className="block bg-zinc-100 w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="block bg-zinc-100 w-full px-3 py-2 border-[1px] rounded-md mb-3 border-zinc-200"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="cursor-pointer bg-blue-400 py-2 px-4 rounded-md text-white" type="submit">
            Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

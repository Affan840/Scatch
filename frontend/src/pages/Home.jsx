import { useState } from "react"
import { Login, SignUp } from "../components"

const Home = () => {
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <div className="flex h-screen relative xl:px-32 2xl:px-60 px-20 flex-col items-center justify-center lg:flex-row">
      <div className="lg:hidden flex justify-between absolute top-40 gap-4 mb-4 py-1 rounded-md bg-zinc-200">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "signup" ? "bg-blue-400 text-white" : "bg-zinc-200 text-black"}`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "login" ? "bg-blue-400 text-white" : "bg-zinc-200 text-black"}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
      </div>
      <div className="w-full lg:gap-48 xl:gap-60 lg:flex hidden">
        <SignUp />
        <Login />
      </div>
      <div className="w-full flex flex-col items-center lg:hidden">
        {activeTab === "signup" ? <SignUp /> : <Login />}
      </div>
    </div>
  );


}

export default Home
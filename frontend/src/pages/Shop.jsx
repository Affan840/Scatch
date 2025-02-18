import { useEffect } from "react";
import { Cart, Products, SideBar } from "../components";
import axios from "axios";
import { useUser } from "../contexts";
import { useNavigate } from "react-router";

const Shop = () => {
  return (
      <div className="w-full h-screen flex items-start px-3 md:px-8 py-12 lg:px-8 lg:py-20">
        <SideBar />
        <Products />
        <Cart />
      </div>
  );
};

export default Shop;

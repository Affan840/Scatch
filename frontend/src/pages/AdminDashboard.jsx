"use client";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { AdminSidebar } from "../components";
import { useOwner } from "../contexts/OwnerContext";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { ownerData } = useOwner();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!ownerData) {
      navigate("/owners");
    }
  }, [ownerData, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center h-16 px-4 bg-white border-b shrink-0 md:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md tablet:hidden tablet:bg-red-500 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-lg font-semibold md:text-xl">
            Admin Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

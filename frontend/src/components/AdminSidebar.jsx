"use client"
import { LayoutDashboard, Package, ShoppingCart, X } from "lucide-react"
import { NavLink } from "react-router"

const AdminSidebar = ({ open, setOpen }) => {
  const menuItems = [
    { title: "All Products", icon: LayoutDashboard, url: "/owners/dashboard" },
    {
      title: "Create Product",
      icon: Package,
      url: "/owners/dashboard/createProduct"
    },
    { title: "All Orders", icon: ShoppingCart, url: "/owners/dashboard/orders" }
  ]

  return (
    <div
      className={` fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } tablet:relative tablet:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-md tablet:hidden focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map(item => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar
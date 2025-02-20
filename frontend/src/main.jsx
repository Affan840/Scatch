import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminDashboard, AdminPage, Home, Shop } from "./pages";
import {
  AdminProducts,
  AllOrders,
  Checkout,
  CreateProduct,
  OrderDetails,
  Products,
  ThankYou,
  UserOrders,
} from "./components";
import { OwnerProvider, ProductsProvider, UserProvider } from "./contexts";
import { User } from "lucide-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <App />
      </UserProvider>
    ),
    children: [
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "auth",
        element: <Home />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "thankyou",
        element: <ThankYou />,
      },
      {
        path: "myorders",
        element: <UserOrders />,
      },
      {
        path: "myorders/:orderId",
        element: <OrderDetails />,
      },
    ],
  },
  {
    path: "owners",
    element: (
      <OwnerProvider>
        <AdminPage />
      </OwnerProvider>
    ),
  },
  {
    path: "/owners/dashboard",
    element: (
      <OwnerProvider>
        <UserProvider>
        <ProductsProvider>
          <AdminDashboard />
        </ProductsProvider>
        </UserProvider>
      </OwnerProvider>
    ),
    children: [
      {
        index: true,
        element: <AdminProducts />,
      },
      {
        path: "createProduct",
        element: <CreateProduct />,
      },
      {
        path: "orders",
        element: <AllOrders />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

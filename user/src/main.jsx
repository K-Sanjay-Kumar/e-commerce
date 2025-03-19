import React from "react";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./components/Footer/Footer.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./components/Login/login.jsx";
import VerifyOTP from "./components/Login/otplogin.jsx";
import Profile from "./components/Settings/profile.jsx";
import Orders from "./components/Orders/orders.jsx";
import ProductDetails from "./components/Products/productDetails.jsx";
import BuyerLayout from "./components/Buyer/BuyerLayout.jsx";
import BuyerProductDetails from "./components/Buyer/BuyerProductDetails.jsx";
import BuyerOrderPage from "./components/Orders/BuyerOrderPage.jsx";

const MainLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/buyer/product/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet /> {/* This renders the child route components */}
      {!hideNavbar && <Footer />}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <App /> },
      { path: "login", element: <Login /> },
      { path: "verify-otp", element: <VerifyOTP /> },
      { path: "account", element: <Profile /> },
      { path: "orders", element: <Orders /> },
      { path: "product/:id", element: <ProductDetails /> },
      {
        path: "buyer",
        element: <BuyerLayout />,
        children: [
          { path: "product/:encodedKey", element: <BuyerProductDetails /> },
          { path: "product/order/:encodedKey", element: <BuyerOrderPage /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
    
      <RouterProvider router={router} />
    
  </GoogleOAuthProvider>
);



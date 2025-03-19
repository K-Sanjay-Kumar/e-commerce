import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import User from "./user";
import axios from 'axios';
import { useEffect } from "react";

const Navbar = () => {
  const [orderCount, setOrderCount] = useState(0);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (storedUser) {
      axios
        .get(import.meta.env.VITE_SERVER_URL+`/api/orders/count/${token}`)
        .then((response) => {
          setOrderCount(response.data.count)
        })
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, []);


  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <a href="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              Shopsy
            </a>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">

            <div>
              <User />
            </div>

            {/* Order button with cart count */}
            <button
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 relative group"
              onClick={() => window.location.href = "/orders"}
            >
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />

              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {orderCount}
              </span>
            </button>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;


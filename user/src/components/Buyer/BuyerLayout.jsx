import React from "react";
import { Outlet } from "react-router-dom";
import "./BuyerProductDetails.css";

const BuyerLayout = () => {
  return (
    <div className="buyer-container">
      <Outlet /> {/* This will render the buyer pages */}
    </div>
  );
};

export default BuyerLayout;

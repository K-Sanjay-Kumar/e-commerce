import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";
import "./BuyerOrderPage.css";

const BuyerOrderPage = () => {
  const { encodedKey } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL+`/api/seller/buyerproduct/${encodedKey}`)
      .then((response) => {
        if (response.data.success) {
          setProductData(response.data.data);
        } else {
          setProductData(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [encodedKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const orderDetails = {
      encryptedUserId: productData.token, // Replace with the actual logged-in user ID
      customer: formData.name,
      productId: productData.product_id,
      productImage: productData.images?.[0],
      productTitle: productData.title,
      paymentId: "PAY-" + Math.floor(1000 + Math.random() * 9000), // Temporary Payment ID
      paymentMode: "COD", // Default to Cash on Delivery
      paymentStatus: "Pending",
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      totalAmt: productData.final_price,
      status: "Ordered",
    };
  
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL+"/api/orders/place-order", orderDetails);
      if (response.data.success) {
        alert("Order placed successfully! 🚀");
        setFormData({ name: "", email: "", mobile: "", address: "", city: "", state: "", pincode: "" }); // Clear form
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!productData) return <p>Product not found!</p>;

  return (
    <>
    {/* Header */}
        <header className="header">
            <div className="logo">
                <img src={Logo} alt="Logo" className="w-10" />
            </div>
            <div className="welcome-message">Welcome to Uniq Cart</div>
        </header>

        <div className="order-page">
        <h2>Order Summary</h2>
        <div className="order-details">
            <img src={productData.images?.[0]} alt={productData.title} className="order-image" />
            <div className="order-info">
                <h3><b>{productData.title}</b></h3>
                <p className="final-price">Price: ₹{productData.final_price}</p>
            </div>
        </div>

        {/* Order Form */}
        <form className="order-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} required />
            <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required></textarea>
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
            <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

            <button type="submit" className="place-order">Place Order</button>
        </form>

        </div>

        {/* Footer */}
        <footer className="footer">&copy; {new Date().getFullYear()} Uniq Cart. All Rights Reserved.</footer>
    </>
  );
};

export default BuyerOrderPage;

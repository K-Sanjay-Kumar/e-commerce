import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/logo.png";
import "./BuyerProductDetails.css";

const BuyerProductDetails = () => {
  const navigate = useNavigate();
  const { encodedKey } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!encodedKey) return;
    axios
      .get(`/api/seller/buyerproduct/${encodedKey}`)
      .then((response) => {
        if (response.data.success) {
          setProductData(response.data.data);
          setSelectedImage(response.data.data.images?.[0]); // Default first image
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

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  if (!productData) {
    return (
      <div className="error-container">
        <p>Product not found!</p>
        <Link to="/" className="back-button">Back to Shop</Link>
      </div>
    );
  }

  const strikeThroughPrice = Math.round(productData.final_price * 1.2);

  const handleBuyNow = () => {
    navigate(`/buyer/product/order/${encodedKey}`);
  };
  

  return (
    <div className="buyer-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={Logo} alt="Logo" className="w-10" />
        </div>
        <div className="welcome-message">Welcome to Uniq Cart</div>
      </header>

      {/* Product Content */}
      <div className="product-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={selectedImage} alt={productData.title} />
          </div>

          <div className="thumbnail-gallery">
            {productData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${productData.title} ${index + 1}`}
                className={`thumbnail ${selectedImage === image ? "active" : ""}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1 className="product-title">{productData.title}</h1>
          <p className="product-description">{productData.description}</p>

          {/* About the Product */}
          <b>About the Product</b>
          <ul className="product-points">
            {productData.points && productData.points.length > 0 ? (
              productData.points.map((point, index) => (
                <li key={index} className="point-item">{point}</li>
              ))
            ) : (
              <li className="point-item">No details available</li>
            )}
          </ul>

          {/* Pricing */}
          <div className="pricing-section">
            <p className="strike-price">₹{strikeThroughPrice}</p>
            <h2 className="final-price">₹{productData.final_price}</h2>
          </div>
          {/* Urgency Message */}
          <p className="limited-stock">🔥 Hurry! Limited Stock Available 🔥</p> <br />

          {/* Buy Button */}
          <button className="buy-now-button" onClick={handleBuyNow} >Buy Now</button>
          
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">&copy; {new Date().getFullYear()} Uniq Cart. All Rights Reserved.</footer>
    </div>
  );
};

export default BuyerProductDetails;



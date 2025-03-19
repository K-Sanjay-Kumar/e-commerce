import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShareAlt } from "react-icons/fa";
import axios from "axios";
const ProductDetails = () => {
  
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [profitPrice, setProfitPrice] = useState(0);
  const [savedPrice, setSavedPrice] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/products/get/${id}`)
      .then((response) => {
        setProduct(response.data.data);
        setSelectedImage(response.data.data.images[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`/api/seller/get-profit`, {
        params: { encryptedUserId: token, product_id: id }
      })
      .then((response) => {
        if (response.data.success && response.data.data) {
          setSavedPrice(response.data.data.profit_price);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching saved profit price:", error);
        setLoading(false);
      });
  }, [id, token]);
  

  if (loading) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  if (!product) {
    return (
      <div className="container">
        <Link to="/" className="flex items-center text-gray-600 hover:text-primary">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
        <div className="mt-8">
          <p className="text-center mt-12 mb-12">Product not found!</p>
        </div>
      </div>
    );
  }

  // Final price calculation
  const finalPrice = product.price + Number(savedPrice !== null ? savedPrice : profitPrice);

  // Save price function
  const handleSavePrice = async () => {
    try {
      await axios.post(`/api/seller/save-profit`, {
        encryptedUserId: token,
        product_id: id,
        profit_price: profitPrice,
        base_price: product.price,
        final_price: product.price + Number(profitPrice),
      }).then((response) => {
        console.log(response.data);
      });
      setSavedPrice(profitPrice);
      setIsEditing(false);
      alert("Profit price saved successfully!");
    } catch (error) {
      console.error("Error saving profit price:", error);
      alert("Failed to save profit price.");
    }
  };

  // Edit price function
  const handleEditPrice = () => {
    setIsEditing(true);
  };

  // Share function
  const handleShare = async () => {
    if (!product.Code || !token) {
      return alert("Invalid product or seller information!");
    }
  
    try {
      // Generate a short encoded key combining token, product ID, and timestamp
      const rawKey = `${token.slice(-4)}${id.slice(-4)}${Date.now() % 1e6}`;
      const encodedKey = btoa(rawKey).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10); 
  
      // Save share code to the database
      const { data } = await axios.post("/api/seller/store-share-code", {
        encryptedUserId: token,
        product_id: id,
        share_code: encodedKey,
      });
  
      if (data.success) {
        const productURL = `${window.location.origin}/buyer/product/${encodedKey}`;
        await navigator.clipboard.writeText(productURL);
        alert("Product link copied!");
      } else {
        alert("Failed to generate share link!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Something went wrong!");
    }
  };
  

  return (
    <div className="container mt-12 mb-14">
      <Link to="/" className="flex items-center text-gray-600 hover:text-primary">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="flex flex-col md:flex-row mt-8 gap-8">
        {/* Image Section */}
        <div className="w-full max-w-sm mx-auto md:mx-0">
          <img src={selectedImage} alt="Product" className="w-full object-cover border rounded-lg" />
          <div className="flex gap-2 mt-4">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Product Thumbnail"
                className={`w-16 h-16 border rounded-lg cursor-pointer ${
                  selectedImage === img ? "border-primary border-2" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name} - </h1>
          <p className="text-gray-500 mb-4">{product.description}</p>

          <b>About the product</b>
          <b>About the product</b>
          <ul className="list-disc pl-5 mb-4">
            {product.points && product.points.length > 0 ? (
              product.points.map((point, index) => (
                <li key={index} className="text-gray-500">{point}</li>
              ))
            ) : (
              <li className="text-gray-500">No details available</li>
            )}
          </ul>

          {/* Base Price */}
          <p className="text-gray-500 mb-2" style={{color:'red'}}>Base Price: ₹{product.price}</p>

          {/* Profit Input */}
          {isEditing ? (
            <div className="mb-4">
              <label className="block text-lg font-semibold">Enter Your Profit:</label>
              <input
                type="number"
                className="border p-2 rounded w-full mt-2"
                placeholder="Enter extra price"
                value={profitPrice}
                onChange={(e) => setProfitPrice(e.target.value)}
              />
              <button
                className="bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600"
                onClick={handleSavePrice}
              >
                Save Price
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-lg font-semibold" style={{color:'green'}}>Your Profit: ₹{savedPrice}</p>
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded mt-2 hover:bg-yellow-600"
                onClick={handleEditPrice}
              >
                Edit Price
              </button>
            </div>
          )}

          {/* Final Selling Price */}
          <p className="text-primary text-2xl font-semibold mb-4">Final Selling Price: ₹{finalPrice}</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            {/* <button className="bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark duration-300">
              Add to Cart
            </button>

            <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 duration-300">
              Buy Now
            </button> */}

            {/* Share Button */}
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 duration-300 flex items-center"
              onClick={() => handleShare(product.Code, token)}
            >
              <FaShareAlt className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;



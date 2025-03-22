import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { VscLinkExternal } from "react-icons/vsc";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL+"/api/products/get")
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-12" style={{paddingBottom:'30px'}}>
      <div className="container">
        <div className="text-left mb-24">
          <h1 className="text-primary font-bold text-3xl">Products</h1>
          <p className="text-xs text-gray-400">Top Selling Products for you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 duration-300 group"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full max-w-[140px] transform group-hover:scale-110 duration-300"
                />
              </div>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-xl font-semibold hover:text-primary duration-300">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  {/* Display old price with a strikethrough */}
                  <span className="text-gray-400 text-sm line-through">₹{product.oldPrice}</span>
                  {/* Display current price */}
                  <span className="text-primary font-bold text-lg">₹{product.price}</span>
                </div>
                <Link to={`/product/${product._id}`}>
                  <button className="mt-4 w-full py-2 bg-primary text-white rounded-full hover:bg-black/80 group-hover:bg-primary-dark">
                    <strong style={{display:'flex', justifyContent:'center', alignItems:'center'}}>View Details &nbsp; <VscLinkExternal /></strong>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;


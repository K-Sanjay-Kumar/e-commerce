import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css"; // Import the CSS file for styling

const Orders = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const encryptedId = localStorage.getItem("token"); // Extract encryptedId from storedUser
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!encryptedId) {
      setError("User not logged in!");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL+`/api/orders/getUserOrders/${encryptedId}`);
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [encryptedId]);


  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.orderId}>
              <img className="order-image" src={order.productImage || "https://via.placeholder.com/100"} alt={order.productTitle} />
              <div className="order-details">
                <h3 className="order-title">{order.productTitle}</h3>
                <p><strong>Ordered On:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> ₹{order.totalAmt}</p>
                <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span></p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;


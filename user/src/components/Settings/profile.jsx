import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa"; // Import cross icon

const Profile = () => {
    const [user, setUser] = useState(null);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem('token');
    const [ordersCount, setOrdersCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        address_line: "",
        state: "",
        city: "",
        country: "",
        pincode: "",
        mobile: "",
    });

    const encryptedUserId = token;

    useEffect(() => {
        if (storedUser) {
            setUser(storedUser);
            axios
                .get(`/api/orders/count/${token}`)
                .then((response) => setOrdersCount(response.data.count))
                .catch((error) => console.error("Error fetching orders:", error));

            fetchAddresses(token);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddAddress = () => {
        axios
            .post("/api/address/add", { ...formData, encryptedUserId: token })
            .then(() => {
                alert("Address added successfully!");
                fetchAddresses(token);
                setIsModalOpen(false);
                // Reset the form data
                setFormData({
                    name: "",
                    address_line: "",
                    state: "",
                    city: "",
                    country: "",
                    pincode: "",
                    mobile: "",
                });
            })
            .catch((error) => {
                console.error("Error adding address:", error);
                alert("Failed to add address!");
            });
    };

    // Function to fetch addresses
    const fetchAddresses = (id) => {
        axios
            .get(`/api/address/get/${id}`)
            .then((response) => setAddresses(response.data.data))
            .catch((error) => console.error("Error fetching addresses:", error));
    };

    // Function to delete an address
    const handleDeleteAddress = (addressId) => {
        axios
            .delete(`/api/address/deleteAddress`, {
                data: { encryptedUserId, addressId },
            })
            .then(() => {
                alert("Address deleted successfully!");
                fetchAddresses(encryptedUserId);
            })
            .catch((error) => {
                console.error("Error deleting address:", error);
                alert("Failed to delete address!");
            });
    };

    return (
        <div className="container mx-auto mt-10 p-6">
            {/* {user && (
                <div className="max-w-lg w-full mx-auto bg-white shadow-lg rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 text-center sm:text-left">
                        <img
                            src={user.picture || "/default-avatar.png"}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border mx-auto sm:mx-0"
                        />
                        <div className="mt-4 sm:mt-0">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-500">Orders: {ordersCount}</p>
                        </div>
                    </div>

                    <button
                        className="mt-6 w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Address
                    </button>
                </div>
            )} */}

            {user && (
                <div className="max-w-3xl w-full mx-auto bg-[#ed8900] text-white shadow-lg rounded-xl p-8 relative overflow-hidden">
                    {/* Profile Image & User Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
                        <img
                            src={user.picture || "/default-avatar.png"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                        />
                        <div className="mt-4 sm:mt-0 text-center sm:text-left">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-lg opacity-90">{user.email}</p>
                            <p className="text-lg font-semibold mt-1">Orders: {ordersCount}</p>
                        </div>
                    </div>

                    {/* Add Address Button */}
                    <button
                        className="mt-6 w-full sm:w-auto bg-white text-[#ed8900] font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Address
                    </button>
                </div>
            )}


            <div className="saved-address" style={{ padding: '10px 80px' }}>
                {/* Saved Address */}
                <h3 className="mt-6 text-2xl font-semibold text-gray-800">Saved Addresses</h3>
                {addresses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {addresses.map((address) => (
                            <div key={address.id} className="relative p-5 bg-white border rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                                {/* Delete Button */}
                                <button 
                                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition duration-200"
                                    onClick={() => handleDeleteAddress(address._id)}
                                >
                                    <FaTimes size={18} />
                                </button>

                                {/* Address Details */}
                                <h4 className="text-lg font-semibold text-gray-700">{address.name}</h4>
                                <p className="text-gray-600 mt-1">{address.address_line}, {address.city}, {address.state}</p>
                                <p className="text-gray-500 text-sm">{address.country} - {address.pincode}</p>
                                <p className="mt-2 text-gray-700"><strong>Mobile:</strong> {address.mobile}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-4">No addresses saved.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add Address</h2>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded mb-2" />
                        <textarea name="address_line" value={formData.address_line} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded mb-2" />
                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded mb-2" />
                        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded mb-2" />
                        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full border p-2 rounded mb-2" />
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded mb-2" />
                        <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full border p-2 rounded mb-2" />

                        <div className="flex justify-between">
                            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddAddress}>Save</button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;


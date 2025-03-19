import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from URL params
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        images: [],
        sizes: [0, 0, 0],
        points: []
    });

    useEffect(() => {
        // Fetch product details when component mounts
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_SERVER_URL+`/api/products/get/${id}`);
                const product = response.data.data;

                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    oldPrice: product.oldPrice,
                    images: product.images || [],
                    sizes: product.sizes || [0, 0, 0],
                    points: product.points || []
                });
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSizeChange = (index, value) => {
        const updatedSizes = [...formData.sizes];
        updatedSizes[index] = Number(value);
        setFormData({ ...formData, sizes: updatedSizes });
    };

    const handlePointChange = (index, value) => {
        const updatedPoints = [...formData.points];
        updatedPoints[index] = value;
        setFormData({ ...formData, points: updatedPoints });
    };

    const addPoint = () => {
        setFormData({ ...formData, points: [...formData.points, ""] });
    };

    const removePoint = (index) => {
        const updatedPoints = formData.points.filter((_, i) => i !== index);
        setFormData({ ...formData, points: updatedPoints });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setFormData({ ...formData, images: [...formData.images, ...newImages] });
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = async (e) => {
        setLoader(true);
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("price", formData.price);
            formDataToSend.append("oldPrice", formData.oldPrice);
            formDataToSend.append("sizes", JSON.stringify(formData.sizes));
            formDataToSend.append("points", JSON.stringify(formData.points));

            formData.images.forEach((img) => {
                if (img.file) {
                    formDataToSend.append("images", img.file);
                }
            });
            
            const response = await axios.put(import.meta.env.VITE_SERVER_URL+`/api/products/update/${id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setLoader(false);
            alert(response.data.message);
            navigate("/products");
        } catch (error) {
            setLoader(false);
            alert("Failed to update product.");
        }
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Edit Product' />
            <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required></textarea>
                    </div>

                    {/* Points */}
                    <div>
                        <label className="block text-sm font-medium">Item Points</label>
                        {formData.points.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={point}
                                    onChange={(e) => handlePointChange(index, e.target.value)}
                                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    required
                                />
                                <button type="button" onClick={() => removePoint(index)} className="bg-red-500 text-white p-1 rounded">✕</button>
                            </div>
                        ))}
                        <button type="button" onClick={addPoint} className="mt-2 bg-green-500 text-white py-1 px-3 rounded">+ Add Point</button>
                    </div>

                    {/* Price and Old Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Old Price</label>
                            <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" />
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="grid grid-cols-3 gap-4">
                        {["Small", "Medium", "Large"].map((size, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium">{size} Size Quantity</label>
                                <input type="number" value={formData.sizes[index]} onChange={(e) => handleSizeChange(index, e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        {loader ? "Updating..." : "Update Product"}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default EditProduct;



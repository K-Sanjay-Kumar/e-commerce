import React, { useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";

const AddProduct = () => {
    const [loader, setLoader] = useState(false);
    // const [formData, setFormData] = useState({
    //     name: "",
    //     description: "",
    //     price: "",
    //     oldPrice: "",
    //     // stock: "",
    //     images: [],
    //     sizes: [0, 0, 0] // Reset sizes
    // });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        images: [],
        sizes: [0, 0, 0],
        points: [] // ✅ Added points field
    });

    const addPoint = () => {
        setFormData({ ...formData, points: [...formData.points, ""] });
    };

    const handlePointChange = (index, value) => {
        const updatedPoints = [...formData.points];
        updatedPoints[index] = value;
        setFormData({ ...formData, points: updatedPoints });
    };

    const removePoint = (index) => {
        const updatedPoints = formData.points.filter((_, i) => i !== index);
        setFormData({ ...formData, points: updatedPoints });
    };

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleSizeChange = (index, value) => {
        const updatedSizes = [...formData.sizes];
        updatedSizes[index] = Number(value);
        setFormData({ ...formData, sizes: updatedSizes });
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
            formDataToSend.append("points", JSON.stringify(formData.points)); // ✅ Send points as JSON
    
            formData.images.forEach((img) => {
                formDataToSend.append("images", img.file);
            });
    
            const response = await axios.post(import.meta.env.VITE_SERVER_URL+"/api/products/add", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            setLoader(false);
            setFormData({
                name: "",
                description: "",
                price: "",
                oldPrice: "",
                images: [],
                sizes: [0, 0, 0],
                points: [] // ✅ Reset points
            });
    
            document.getElementById("message").innerHTML = response.data.message;
            document.getElementById("message").style.color = "green";
    
        } catch (error) {
            document.getElementById("message").innerHTML = "Failed to add product.";
            document.getElementById("message").style.color = "red";
            setLoader(false);
        }
    };
    

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Add Product' />
            <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
                <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                <p id="message"></p>
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

                    {/* stock */}
                    {/* <div>
                        <label className="block text-sm font-medium">stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                    </div> */}

                    {/* Sizes */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Small Size Quantity</label>
                            <input type="number" value={formData.sizes[0]} onChange={(e) => handleSizeChange(0, e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Medium Size Quantity</label>
                            <input type="number" value={formData.sizes[1]} onChange={(e) => handleSizeChange(1, e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Large Size Quantity</label>
                            <input type="number" value={formData.sizes[2]} onChange={(e) => handleSizeChange(2, e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" required />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium">Product Images</label>
                        <input type="file" multiple onChange={handleImageChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white" />
                    </div>

                    {/* Image Preview */}
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img src={img.preview} alt={`Uploaded ${index}`} className="w-full h-24 object-cover rounded-md border border-gray-600" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded-full"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        
                        {loader ? (
                            <div className="flex items-center gap-2">
                                <span className="loader"></span>
                                <span>Product Adding...</span>
                            </div>
                        ) : (
                            <span>Add Product</span>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddProduct;


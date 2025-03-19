import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SellerProductsTable = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/seller/products/get/${id}`);
            setProducts(response.data.data);
            setFilteredProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = products.filter((product) => product.name.toLowerCase().includes(term));
        setFilteredProducts(filtered);
    };

    const handleEdit = (productId) => {
        navigate(`/UpdateProduct/${productId}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        setLoader(true);

        try {
            await axios.delete(`/api/products/delete/${selectedProduct._id}`);
            fetchProducts();
            setLoader(false);
            setShowConfirm(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto max-w-full w-full'>
                <table className='min-w-[800px] md:min-w-full divide-y divide-gray-700'>

                    <thead>
                        <tr className='bg-gray-900'>
                            {[
                                "Code", "Name", "Base Price", "Profit Price", "Final Price", "Share Link", "Updated At"
                            ].map((heading) => (
                                <th key={heading} className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-700'>
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <motion.tr key={product._id} className='border border-gray-700' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                <td className='px-6 py-4'>{product.ProductCode}</td>
                                <td className='px-6 py-4 flex gap-2 items-center'>
                                    {product.ProductName}
                                </td>
                                <td className='px-6 py-4'>${product.base_price || "0.00"}</td>
                                <td className='px-6 py-4'>${product.profit_price}</td>
                                <td className='px-6 py-4'>{product.final_price}</td>
                                <td className='px-6 py-4 text-center'>buyer/product/{product.shareLink}</td>
                                <td className='px-6 py-4'>
                                    {new Date(product.updatedData).toLocaleDateString("en-US", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default SellerProductsTable;



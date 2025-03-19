import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductsTable = () => {
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [showConfirm, setShowConfirm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	// ✅ Fetch product data from the backend
	const fetchProducts = async () => {
		try {
			const response = await axios.get("/api/products/get");
			setProducts(response.data.data);
			setFilteredProducts(response.data.data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	// ✅ Handle search functionality
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = products.filter(
			(product) =>
				product.name.toLowerCase().includes(term) ||
				product.category.toLowerCase().includes(term)
		);
		setFilteredProducts(filtered);
	};

	// ✅ Handle edit navigation
	const handleEdit = (productId) => {
		navigate(`/UpdateProduct/${productId}`);
	};

	// ✅ Show confirmation modal
	const handleDeleteClick = (product) => {
		setSelectedProduct(product);
		setShowConfirm(true);
	};

	// ✅ Handle delete product
	const handleDeleteConfirm = async () => {
		if (!selectedProduct) return;
		setLoader(true);

		try {
			// Send DELETE request to backend
			await axios.delete(`/api/products/delete/${selectedProduct._id}`);

			// Refresh product list
			fetchProducts();
			setLoader(false);

			// Hide confirmation modal
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

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Code</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Category</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Old Price</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Price</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Stock</th>
							<th className='px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider'>Sizes <br /> (s,m,l)</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Sales</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredProducts.map((product) => (
							<motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.Code}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
									<img src={product.images?.[0] || 'https://via.placeholder.com/40'} alt='Product img' className='size-10 rounded-full' />
									{product.name}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category || "N/A"}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${product.oldPrice?.toFixed(2) || "0.00"}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>${product.price.toFixed(2)}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.stock || "0"}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center'>
									{product.sizes ? `[${product.sizes.join(', ')}]` : "[0, 0, 0]"}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.sales || "0"}</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(product._id)}>
										<Edit size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300' onClick={() => handleDeleteClick(product)}>
										<Trash2 size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{/* ✅ Confirmation Popup */}
			{showConfirm && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-gray-900 p-6 rounded-lg shadow-lg text-white'>
						<h2 className='text-lg font-semibold mb-4'>Confirm Deletion</h2>
						<p>Are you sure you want to delete "{selectedProduct?.name}"?</p>
						<div className='flex justify-end mt-4'>
							<button className='bg-gray-600 px-4 py-2 rounded-md mr-2' onClick={() => setShowConfirm(false)}>
								Cancel
							</button>
							<button className='bg-red-500 px-4 py-2 rounded-md' onClick={handleDeleteConfirm}>
								{/* Delete */}
								{loader ? (
									<div className="flex items-center gap-2">
										<span className="loader"></span>
										<span>Deleting...</span>
									</div>
								) : (
									<span>Delete</span>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default ProductsTable;

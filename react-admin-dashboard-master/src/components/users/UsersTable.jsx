import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/api/user/usersList");
				const formattedUsers = response.data.map(user => ({
					...user,
					lastLogin: new Date(user.lastLogin).toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric"
					}),
				}));
				setUsers(formattedUsers);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const filteredUsers = users.filter(user =>
		user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
	);

	const handleView = (id) => {
		navigate("/SellerProducts/"+id);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Avatar</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Name</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Mobile</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Address</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Orders</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Last Login</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Products</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) => (
							<motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
								<td className='px-6 py-4 whitespace-nowrap'>
									<img src={user.avatar} alt={user.name} className='h-10 w-10 rounded-full' />
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-100'>{user.name}</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>{user.email}</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>{user.mobile}</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>
									{/* {user.address} */}
									{user.address && user.address.length > 0 
									? `${user.address[0].address_line}, ${user.address[0].city}`
									: "No Address Available"}

								</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>{user.orders.length}</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
										{user.status}
									</span>
								</td>
								{/* <td className='px-6 py-4 whitespace-nowrap text-gray-300'>{user.last_login_date}</td> */}
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>
									{new Date(user.last_login_date).toLocaleDateString("en-US", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={()=> handleView(user._id)} >View</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>Edit</button>
									<button className='text-red-400 hover:text-red-300'>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default UsersTable;



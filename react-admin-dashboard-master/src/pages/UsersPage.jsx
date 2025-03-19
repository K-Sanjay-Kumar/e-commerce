import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import React, {useState, useEffect} from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";	

const UsersPage = () => {

	const [userStats, setUserStats] = useState({
		totalUsers: 0,
		newUsersToday: 0,
		activeUsers: 0,
		churnRate: "0%",
	});

	// Fetch users list and calculate stats
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/api/user/usersList"); // Existing API
				const users = await response.json();

				const totalUsers = users.length;
				const newUsersToday = users.filter((user) => {
					const createdAt = new Date(user.createdAt);
					const today = new Date();
					return createdAt.toDateString() === today.toDateString();
				}).length;
				const activeUsers = users.filter((user) => user.status === "Active").length;
				const churnRate = totalUsers > 0 ? ((totalUsers - activeUsers) / totalUsers) * 100 : 0;

				setUserStats({
					totalUsers,
					newUsersToday,
					activeUsers,
					churnRate: churnRate.toFixed(2) + "%",
				});
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />
				</motion.div>

				<UsersTable />

			</main>
		</div>
	);
};
export default UsersPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, DollarSign, Package, TrendingUp, Plus } from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import axios from "axios";

const ProductsPage = () => {

    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        topSelling: 0,
        lowStock: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [totalRes, topSellingRes, lowStockRes, revenueRes] = await Promise.all([
                    axios.get("/api/products/total-products-count"),
                    axios.get("/api/products/top-selling-count"),
                    axios.get("/api/products/low-stock-count"),
                    axios.get("/api/products/total-revenue"),
                ]);

                setStats({
                    totalProducts: totalRes.data.total,
                    topSelling: topSellingRes.data.topSelling,
                    lowStock: lowStockRes.data.lowStock,
                    totalRevenue: `$${new Intl.NumberFormat().format(revenueRes.data.revenue)}`
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);


    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Products' />
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold'>Product Management</h2>
                    <button
                        className='bg-blue-500 text-white px-4 py-2 rounded flex items-center'
						onClick={()=> navigate('/AddProduct') }
                    >
                        <Plus className='mr-2' /> Add Product
                    </button>
                </div>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Products' icon={Package} value={stats.totalProducts} color='#6366F1' />
                    <StatCard name='Top Selling' icon={TrendingUp} value={stats.topSelling} color='#10B981' />
                    <StatCard name='Low Stock' icon={AlertTriangle} value={stats.lowStock} color='#F59E0B' />
                    <StatCard name='Total Revenue' icon={DollarSign} value={stats.totalRevenue} color='#EF4444' />
                </motion.div>
                <ProductsTable />
                <div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
                    <SalesTrendChart />
                    <CategoryDistributionChart />
                </div>
            </main>

        </div>
    );
};
export default ProductsPage;


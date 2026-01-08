import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        orderCount: 0,
        productCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Determine counts
                const productsSnap = await getCountFromServer(collection(db, 'products'));
                const ordersSnap = await getDocs(collection(db, 'orders'));

                let sales = 0;
                ordersSnap.forEach(doc => {
                    const data = doc.data();
                    sales += data.total || 0;
                });

                setStats({
                    productCount: productsSnap.data().count,
                    orderCount: ordersSnap.size,
                    totalSales: sales
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">£{stats.totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orderCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.productCount}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

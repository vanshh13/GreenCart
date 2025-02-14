import React, { useEffect, useState } from 'react';
import { 
  Package, Users, ShoppingCart, BarChart2, 
  PieChart, Plus, Settings, Activity, 
  Icon,
  Image,
  IndianRupee
} from 'lucide-react';
import {Card , CardContent} from '../components/ui/Card';
import { NavLink } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavigation';
import axios from 'axios';
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }
  
        const { data } = await axios.get("http://localhost:5000/api/admins/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log(data);
        setStats(data);
        
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
  
    fetchStats();
  }, []);
  
  const adminFeatures = [
    {
      id: 'add_product',
      title: 'Add Product',
      icon: <Plus />,
      color: 'bg-blue-500',
      link: '/add-product/'
    },
    {
      id: 'manage_products',
      title: 'Manage Products',
      icon: <Package />,
      color: 'bg-green-500',
      link: '/manage-product/'
    },
    {
      id: 'add_admin',
      title: 'Add Admin',
      icon: <Plus />,
      color: 'bg-purple-500',
      link: '/admin/users/add'
    },
    {
      id: 'manage_admins',
      title: 'Manage Admins',
      icon: <Users />,
      color: 'bg-indigo-500',
      link: '/admin/users'
    },
    {
      id: 'order_management',
      title: 'Order Management',
      icon: <ShoppingCart />,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      id: 'analytics',
      title: 'Sales & Profit Analysis',
      icon: <BarChart2 />,
      color: 'bg-red-500',
      link: '/admin/analytics'
    },
    {
      id: 'statistics',
      title: 'Website Statistics',
      icon: <PieChart />,
      color: 'bg-teal-500',
      link: '/admin/statistics'
    }
  ];

  return (
    <div>
    <AdminNavbar />
      {/* Dashboard Content */}
      <div className="max-w-8xl mx-auto mt-9 p-9">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
  {/* Total Users - Yellow */}
  <Card className="bg-yellow-400 text-gray-900 shadow-lg h-36 md:h-44 rounded-xl">
    <CardContent className="p-6 flex flex-col justify-center items-center">
      <Users className="h-12 w-12 mb-2 text-gray-800" />
      <h3 className="text-4xl font-extrabold">{stats.totalUsers}</h3>
      <p className="text-lg font-medium">Total Users</p>
    </CardContent>
  </Card>

  {/* Total Sales - Green */}
  <Card className="bg-green-400 text-black-900 shadow-lg h-36 md:h-44 rounded-xl">
    <CardContent className="p-6 flex flex-col justify-center items-center">
      <IndianRupee className="h-12 w-12 mb-2 text-gray-800" />
      <h3 className="text-4xl font-extrabold">₹{stats.totalSales}</h3>
      <p className="text-lg font-medium">Total Sales</p>
    </CardContent>
  </Card>

  {/* Total Products - Purple */}
  <Card className="bg-pink-500 text-black shadow-lg h-36 md:h-44 rounded-xl">
    <CardContent className="p-6 flex flex-col justify-center items-center">
      <Package className="h-12 w-12 mb-2 text-gray-200" />
      <h3 className="text-4xl font-extrabold">{stats.totalProducts}</h3>
      <p className="text-lg font-medium">Total Products</p>
    </CardContent>
  </Card>

  {/* Total Orders - Light Blue */}
  <Card className="bg-sky-500 text-black shadow-lg h-36 md:h-44 rounded-xl">
    <CardContent className="p-6 flex flex-col justify-center items-center">
      <ShoppingCart className="h-12 w-12 mb-2 text-gray-200" />
      <h3 className="text-4xl font-extrabold">{stats.totalOrders}</h3>
      <p className="text-lg font-medium">Total Orders</p>
    </CardContent>
  </Card>
</div>


        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {adminFeatures.map(feature => (
           <NavLink to={feature.link} key={feature.id}>
           <Card className="hover:shadow-lg transition-shadow cursor-pointer">
             <CardContent className="p-6">
               <div className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mb-4`}>
                 {feature.icon}
               </div>
               <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
               <div className="flex items-center text-gray-600">
                 <Activity className="h-4 w-4 mr-2" />
                 <span className="text-sm">View Details</span>
               </div>
             </CardContent>
           </Card>
         </NavLink>         
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
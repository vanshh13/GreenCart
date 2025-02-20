import React, { useEffect, useState } from 'react';
import { 
  Package, Users, ShoppingCart, BarChart2, 
  PieChart, Plus, Settings, Activity,
  Bell, Calendar, TrendingUp, AlertTriangle,
  IndianRupee,
  BookImage,PlusCircle,ListOrdered
} from 'lucide-react';
import {Card , CardContent} from '../components/ui/Card';
import { NavLink } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavigation';
import axios from 'axios';
import { Alert, AlertDescription } from '../components/ui/Aleart';
import Blog from '../Home/Blog';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order #1234 requires attention", type: "warning" },
    { id: 2, message: "Stock running low for Product X", type: "alert" },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));

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
  const QuickActions = () => (
    <div className="flex gap-4 mb-6">
      <NavLink to= "/admin/users/add">
      <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        <Plus size={16} />
        Quick Add Product
      </button>
      </NavLink>
      <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
        <Bell size={16} />
        View Notifications
      </button>
    </div>
  );
  // Notification Center component
  const NotificationCenter = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell size={20} />
        Recent Notifications
      </h2>
      <div className="space-y-2">
        {notifications.map(notification => (
          <Alert key={notification.id} variant={notification.type === "warning" ? "warning" : "destructive"}>
            <AlertDescription className="flex items-center gap-2">
              <AlertTriangle size={16} />
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
    // Stats Card with loading animation
    const StatsCard = ({ icon: Icon, value, label, color }) => (
      <Card className={`${color} text-white shadow-lg h-36 md:h-44 rounded-xl transform hover:scale-105 transition-transform duration-200`}>
        <CardContent className="p-6 flex flex-col justify-center items-center">
          <Icon className="h-12 w-12 mb-2" />
          <h3 className="text-4xl font-extrabold animate-fadeIn">
            {isLoading ? (
              value) :(
                <div className="h-8 w-24 bg-white/20 rounded animate-pulse" />
              )}
          </h3>
          <p className="text-lg font-medium">{label}</p>
        </CardContent>
      </Card>
    );
  const adminFeatures = [
    {
      id: 'add_product',
      title: 'Add Product',
      icon: <Plus />,
      color: 'bg-blue-500',
      link: '/admin/add-product/'
    },
    {
      id: 'manage_products',
      title: 'Manage Products',
      icon: <Package />,
      color: 'bg-green-500',
      link: '/admin/manage-product/'
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
      id: 'add_blog',
      title: 'Add Blog',
      icon: <PlusCircle />,
      color: 'bg-orange-500',
      link: '/admin/add-blog'
    },
    {
      id: 'manage_blog',
      title: 'Manage Blogs',
      icon: <ListOrdered />,
      color: 'bg-blue-500',
      link: '/admin/manage-blog'
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

//   return (
//     <div>
//     <AdminNavbar />
//       {/* Dashboard Content */}
//       <div className="max-w-8xl mx-auto mt-9 p-9">

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//   {/* Total Users - Yellow */}
//   <Card className="bg-yellow-400 text-gray-900 shadow-lg h-36 md:h-44 rounded-xl">
//     <CardContent className="p-6 flex flex-col justify-center items-center">
//       <Users className="h-12 w-12 mb-2 text-gray-800" />
//       <h3 className="text-4xl font-extrabold">{stats.totalUsers}</h3>
//       <p className="text-lg font-medium">Total Users</p>
//     </CardContent>
//   </Card>

//   {/* Total Sales - Green */}
//   <Card className="bg-green-400 text-black-900 shadow-lg h-36 md:h-44 rounded-xl">
//     <CardContent className="p-6 flex flex-col justify-center items-center">
//       <IndianRupee className="h-12 w-12 mb-2 text-gray-800" />
//       <h3 className="text-4xl font-extrabold">₹{stats.totalSales}</h3>
//       <p className="text-lg font-medium">Total Sales</p>
//     </CardContent>
//   </Card>

//   {/* Total Products - Purple */}
//   <Card className="bg-pink-500 text-black shadow-lg h-36 md:h-44 rounded-xl">
//     <CardContent className="p-6 flex flex-col justify-center items-center">
//       <Package className="h-12 w-12 mb-2 text-gray-200" />
//       <h3 className="text-4xl font-extrabold">{stats.totalProducts}</h3>
//       <p className="text-lg font-medium">Total Products</p>
//     </CardContent>
//   </Card>

//   {/* Total Orders - Light Blue */}
//   <Card className="bg-sky-500 text-black shadow-lg h-36 md:h-44 rounded-xl">
//     <CardContent className="p-6 flex flex-col justify-center items-center">
//       <ShoppingCart className="h-12 w-12 mb-2 text-gray-200" />
//       <h3 className="text-4xl font-extrabold">{stats.totalOrders}</h3>
//       <p className="text-lg font-medium">Total Orders</p>
//     </CardContent>
//   </Card>
// </div>


//         {/* Feature Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//           {adminFeatures.map(feature => (
//            <NavLink to={feature.link} key={feature.id}>
//            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
//              <CardContent className="p-6">
//                <div className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center mb-4`}>
//                  {feature.icon}
//                </div>
//                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
//                <div className="flex items-center text-gray-600">
//                  <Activity className="h-4 w-4 mr-2" />
//                  <span className="text-sm">View Details</span>
//                </div>
//              </CardContent>
//            </Card>
//          </NavLink>         
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
return (
  <div className="min-h-screen bg-gray-50">
    <AdminNavbar/>
    <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
        <p className="text-gray-600">Here's what's happening today</p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Notification Center */}
      <NotificationCenter />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatsCard 
          icon={Users} 
          value={stats.totalUsers}
          label="Total Users"
          color="bg-gradient-to-br from-yellow-400 to-yellow-500"
        />
        <StatsCard 
          icon={IndianRupee} 
          value={`₹${stats.totalSales}`}
          label="Total Sales"
          color="bg-gradient-to-br from-green-400 to-green-500"
        />
        <StatsCard 
          icon={Package} 
          value={stats.totalProducts}
          label="Total Products"
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatsCard 
          icon={ShoppingCart} 
          value={stats.totalOrders}
          label="Total Orders"
          color="bg-gradient-to-br from-sky-500 to-sky-600"
        />
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminFeatures.map((feature, index) => (
          <NavLink to={feature.link} key={feature.id}>
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white">
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
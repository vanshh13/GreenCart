import React from 'react';
import { 
  Package, Users, ShoppingCart, BarChart2, 
  PieChart, Plus, Settings, Activity, 
  Icon,
  Image
} from 'lucide-react';
import {Card , CardContent} from '../components/ui/Card';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {
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
      {/* Admin Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-green-600">GreenCart Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <Image className="h-6 w-6" />
              </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-8xl mx-auto p-9">

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
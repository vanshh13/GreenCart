import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import AdminNavbar from "../components/AdminNavigation";
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, 
  Users, RefreshCw, Calendar, Download
} from "lucide-react";

const AnalysisDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, new: 0, returning: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState("weekly");

  const fetchAnalysisData = async () => {
    setIsRefreshing(true);
    try {
      // Simulating API calls - replace with actual endpoints when available
      const salesRes = await axios.get("http://localhost:5000/api/analytics/sales");
      const productRes = await axios.get("http://localhost:5000/api/analytics/products");
      const userRes = await axios.get("http://localhost:5000/api/analytics/users");
      
      setSalesData(salesRes.data || getMockSalesData());
      setProductData(productRes.data || getMockProductData());
      setUserStats(userRes.data || {
        total: 1250,
        new: 127,
        returning: 865
      });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      // Fallback to mock data if API fails
      setSalesData(getMockSalesData());
      setProductData(getMockProductData());
      setUserStats({
        total: 1250,
        new: 127,
        returning: 865
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Mock data for development/demo
  const getMockSalesData = () => {
    if (timeframe === "weekly") {
      return [
        { name: 'Mon', sales: 4000, orders: 24, returns: 3 },
        { name: 'Tue', sales: 3000, orders: 18, returns: 2 },
        { name: 'Wed', sales: 5000, orders: 32, returns: 1 },
        { name: 'Thu', sales: 2780, orders: 20, returns: 4 },
        { name: 'Fri', sales: 6890, orders: 44, returns: 2 },
        { name: 'Sat', sales: 8390, orders: 55, returns: 0 },
        { name: 'Sun', sales: 3490, orders: 30, returns: 1 }
      ];
    } else {
      return [
        { name: 'Week 1', sales: 25000, orders: 165, returns: 12 },
        { name: 'Week 2', sales: 32000, orders: 198, returns: 8 },
        { name: 'Week 3', sales: 28000, orders: 178, returns: 15 },
        { name: 'Week 4', sales: 35000, orders: 210, returns: 10 }
      ];
    }
  };

  const getMockProductData = () => {
    return [
      { name: 'Organic Apples', sales: 1200, value: 40 },
      { name: 'Fresh Spinach', sales: 800, value: 25 },
      { name: 'Avocados', sales: 1500, value: 20 },
      { name: 'Tomatoes', sales: 500, value: 15 }
    ];
  };

  useEffect(() => {
    fetchAnalysisData();
  }, [timeframe]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportToPDF = () => {
    alert("Exporting analysis report to PDF...");
    // Implement actual PDF export functionality here
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <RefreshCw size={40} className="text-green-600"/>
      </motion.div>
      <p className="mt-4 text-lg">Loading analysis data...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales & Performance Analysis</h1>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="weekly">Weekly View</option>
              <option value="monthly">Monthly View</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAnalysisData}
              className="p-2 bg-white rounded-full shadow"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : {}}
                transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              >
                <RefreshCw size={20} className="text-gray-600" />
              </motion.div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className="p-2 bg-white rounded-full shadow"
            >
              <Download size={20} className="text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">
                    ${salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
                  </p>
                  <span className="flex items-center text-green-500 ml-2 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    12%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-blue-100">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">
                    {salesData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                  </p>
                  <span className="flex items-center text-green-500 ml-2 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    8%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-red-100">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Return Rate</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">
                    {(salesData.reduce((sum, item) => sum + item.returns, 0) / 
                      salesData.reduce((sum, item) => sum + item.orders, 0) * 100).toFixed(1)}%
                  </p>
                  <span className="flex items-center text-red-500 ml-2 text-sm">
                    <ArrowDownRight className="h-3 w-3" />
                    2%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold">{userStats.total.toLocaleString()}</p>
                  <span className="flex items-center text-green-500 ml-2 text-sm">
                    <ArrowUpRight className="h-3 w-3" />
                    15%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue & Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales ($)" />
                  <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productData.map((product, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sales}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(product.sales * 12.99).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'New Users', value: userStats.new },
                      { name: 'Returning', value: userStats.returning },
                      { name: 'Inactive', value: userStats.total - userStats.new - userStats.returning }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600">New Users</span>
                  </div>
                  <span className="text-sm font-medium">{userStats.new}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Returning Users</span>
                  </div>
                  <span className="text-sm font-medium">{userStats.returning}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Inactive Users</span>
                  </div>
                  <span className="text-sm font-medium">{userStats.total - userStats.new - userStats.returning}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisDashboard;
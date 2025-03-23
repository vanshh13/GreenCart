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
  ArrowUpRight, ArrowDownRight, ShoppingCart, 
  Users, RefreshCw, Calendar, Download,
  IndianRupee
} from "lucide-react";

const AnalysisDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, new: 0, returning: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState("weekly");
  const [performanceMetrics, setPerformanceMetrics] = useState({
    revenue: { value: 0, percentage: 0, isPositive: true },
    orders: { value: 0, percentage: 0, isPositive: true },
    returnRate: { value: 0, percentage: 0, isPositive: false },
    users: { value: 0, percentage: 0, isPositive: true }
  });
  const [apiError, setApiError] = useState(null);

  const fetchAnalysisData = async () => {
    setIsRefreshing(true);
    setApiError(null);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Log request details for debugging
      console.log(`Fetching sales data for timeframe: ${timeframe}`);
      
      // Fetch sales data
      const salesRes = await axios.get(`http://localhost:5000/api/admins/analytics/sales/${timeframe}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Sales API Response:", salesRes.data);
      
      // Fetch product data
      const productRes = await axios.get(`http://localhost:5000/api/admins/analytics/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Product API Response:", productRes.data);
      
      // Fetch user data
      const userRes = await axios.get(`http://localhost:5000/api/admins/analytics/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("User API Response:", userRes.data);
      
      // Check if we have valid data before updating state
      if (!salesRes.data || !Array.isArray(salesRes.data) || salesRes.data.length === 0) {
        throw new Error("Invalid or empty sales data received from API");
      }
      
      if (!productRes.data || !Array.isArray(productRes.data) || productRes.data.length === 0) {
        throw new Error("Invalid or empty product data received from API");
      }
      
      if (!userRes.data || typeof userRes.data !== 'object') {
        throw new Error("Invalid user statistics data received from API");
      }
      
      // Set data from API responses
      setSalesData(salesRes.data);
      setProductData(productRes.data);
      setUserStats(userRes.data);
      
      // Calculate performance metrics from API data
      calculatePerformanceMetrics(salesRes.data, userRes.data);
      
    } catch (error) {
      // Detailed error handling
      console.error("Error fetching analysis data:", error);
      
      // Set specific error message for user
      setApiError(
        error.response 
          ? `API Error (${error.response.status}): ${error.response.data?.message || error.message}`
          : `Network Error: ${error.message}. Please check if your API server is running.`
      );
      
      // Uncomment the following ONLY for debugging - remove for production
      // alert(`API Error: ${error.message}. Check console for details.`);
      
      // Important: DON'T use mock data in production
      // For development, you can conditionally use mock data based on a dev flag
      // const isDevelopment = process.env.NODE_ENV === 'development';
      
      // if (isDevelopment) {
      //   // Use mock data only in development mode
      //   const mockSalesData = getMockSalesData();
      //   setSalesData(mockSalesData);
      //   setProductData(getMockProductData());
      //   setUserStats({ total: 1250, new: 127, returning: 865 });
      //   calculatePerformanceMetrics(mockSalesData, { total: 1250, new: 127, returning: 865 });
      // }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Calculate performance metrics from API data
  const calculatePerformanceMetrics = (sales, users) => {
    // Only calculate if we have valid data
    if (!sales || !Array.isArray(sales) || sales.length === 0) {
      console.warn("Cannot calculate metrics: Invalid sales data");
      return;
    }
    
    const totalRevenue = sales.reduce((sum, item) => sum + (item.sales || 0), 0);
    const totalOrders = sales.reduce((sum, item) => sum + (item.orders || 0), 0);
    const totalReturns = sales.reduce((sum, item) => sum + (item.returns || 0), 0);
    const returnRate = totalOrders > 0 ? (totalReturns / totalOrders * 100) : 0;
    
    // In real application, you would get these percentages from comparing
    // current period with previous period in your API
    setPerformanceMetrics({
      revenue: { 
        value: totalRevenue, 
        percentage: 12.5, // From API or calculate from historical data
        isPositive: true
      },
      orders: { 
        value: totalOrders, 
        percentage: 8.3,
        isPositive: true
      },
      returnRate: { 
        value: returnRate, 
        percentage: 2.1,
        isPositive: false // For return rate, lower is better
      },
      users: { 
        value: users.total || 0, 
        percentage: 15.7,
        isPositive: true
      }
    });
  };
  
  // These mock data functions should ONLY be used during development
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

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Error loading data:</p>
            <p>{apiError}</p>
            <p className="mt-2">Using cached or no data. Check your API connection and refresh the page.</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full p-3 bg-green-100">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {performanceMetrics.revenue.value.toLocaleString()}
                  </p>
                  <span className={`flex items-center ${performanceMetrics.revenue.isPositive ? 'text-green-500' : 'text-red-500'} ml-2 text-sm`}>
                    {performanceMetrics.revenue.isPositive ? 
                      <ArrowUpRight className="h-3 w-3" /> : 
                      <ArrowDownRight className="h-3 w-3" />}
                    {performanceMetrics.revenue.percentage}%
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
                    {performanceMetrics.orders.value.toLocaleString()}
                  </p>
                  <span className={`flex items-center ${performanceMetrics.orders.isPositive ? 'text-green-500' : 'text-red-500'} ml-2 text-sm`}>
                    {performanceMetrics.orders.isPositive ? 
                      <ArrowUpRight className="h-3 w-3" /> : 
                      <ArrowDownRight className="h-3 w-3" />}
                    {performanceMetrics.orders.percentage}%
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
                    {performanceMetrics.returnRate.value.toFixed(1)}%
                  </p>
                  <span className={`flex items-center ${!performanceMetrics.returnRate.isPositive ? 'text-green-500' : 'text-red-500'} ml-2 text-sm`}>
                    {!performanceMetrics.returnRate.isPositive ? 
                      <ArrowDownRight className="h-3 w-3" /> : 
                      <ArrowUpRight className="h-3 w-3" />}
                    {performanceMetrics.returnRate.percentage}%
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
                  <span className={`flex items-center ${performanceMetrics.users.isPositive ? 'text-green-500' : 'text-red-500'} ml-2 text-sm`}>
                    {performanceMetrics.users.isPositive ? 
                      <ArrowUpRight className="h-3 w-3" /> : 
                      <ArrowDownRight className="h-3 w-3" />}
                    {performanceMetrics.users.percentage}%
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
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip formatter={(value, name) => {
                      if (name === "Sales (₹)" || name === "sales") {
                        return [`₹${value.toLocaleString()}`, "Sales"];
                      }
                      return [value, name === "orders" ? "Orders" : name];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales (₹)" />
                    <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      if (name === "sales") {
                        return [`₹${value.toLocaleString()}`, "Sales"];
                      }
                      return [value, name === "orders" ? "Orders" : name];
                    }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales (₹)" />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">No trend data available</p>
                </div>
              )}
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
              {productData.length > 0 ? (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {(product.sales * 12.99).toFixed(2)}
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
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">No product data available</p>
                </div>
              )}
            </CardContent>
          </Card>


          <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Segments</CardTitle>
      </CardHeader>
      <CardContent>
        {userStats.total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}> 
              <PieChart>
                <Pie
                  data={[
                    { name: "New Users", value: userStats.new },
                    { name: "Returning Users", value: userStats.returning },
                    { name: "Inactive Users", value: userStats.total - userStats.new - userStats.returning },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Reduced inner radius
                  outerRadius={70} // Reduced outer radius
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent, x, y }) => (
                    <text
                      x={x}
                      y={y}
                      fill="black"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12px"
                      fontWeight="bold"
                    >
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  )}
                  labelLine={false}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {[
                { label: "New Users", color: "bg-blue-500", value: userStats.new },
                { label: "Returning Users", color: "bg-green-500", value: userStats.returning },
                { label: "Inactive Users", color: "bg-yellow-500", value: userStats.total - userStats.new - userStats.returning },
              ].map(({ label, color, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
            <p className="text-gray-500">No user data available</p>
          </div>
        )}
      </CardContent>
    </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AdminNavbar from "../components/AdminNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { 
  TrendingUp, Users, ShoppingBag, CreditCard, 
  Star, RefreshCw, FileText, Calendar, Download
} from "lucide-react";

const AdminStatistics = () => {
  const [period, setPeriod] = useState("last30days");
  const [isLoading, setIsLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState({});
  const [visitorStats, setVisitorStats] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [ratingStats, setRatingStats] = useState([]);
  const [salesByPayment, setSalesByPayment] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulating API calls - replace with your actual endpoints
        // const overviewRes = await axios.get(`http://localhost:5000/api/statistics/overview?period=${period}`);
        // const visitorRes = await axios.get(`http://localhost:5000/api/statistics/visitors?period=${period}`);
        // const productRes = await axios.get(`http://localhost:5000/api/statistics/products/top`);
        // const ratingRes = await axios.get(`http://localhost:5000/api/statistics/ratings`);
        // const paymentRes = await axios.get(`http://localhost:5000/api/statistics/sales/payment`);
        
        // Mock data for demonstration
        const mockOverviewStats = {
          totalSales: 138570,
          totalOrders: 1243,
          totalCustomers: 879,
          averageOrderValue: 111.48,
          conversionRate: 3.2,
          salesChange: 12.5,
          ordersChange: 8.3,
          customersChange: 15.7,
        };

        const mockVisitorStats = [
          { date: "Feb 1", visitors: 320, orders: 24 },
          { date: "Feb 5", visitors: 380, orders: 29 },
          { date: "Feb 10", visitors: 520, orders: 41 },
          { date: "Feb 15", visitors: 480, orders: 39 },
          { date: "Feb 20", visitors: 580, orders: 46 },
          { date: "Feb 25", visitors: 680, orders: 53 },
          { date: "Mar 1", visitors: 720, orders: 58 },
        ];

        const mockProductStats = [
          { name: "Organic Apples", sales: 1230, revenue: 4920 },
          { name: "Fresh Spinach", sales: 890, revenue: 2670 },
          { name: "Avocado Pack", sales: 750, revenue: 3750 },
          { name: "Tomatoes", sales: 680, revenue: 2040 },
          { name: "Almond Milk", sales: 560, revenue: 2800 },
        ];

        const mockRatingStats = [
          { rating: "5 Stars", count: 430, percentage: 58 },
          { rating: "4 Stars", count: 210, percentage: 28 },
          { rating: "3 Stars", count: 75, percentage: 10 },
          { rating: "2 Stars", count: 18, percentage: 2 },
          { rating: "1 Star", count: 12, percentage: 2 },
        ];

        const mockSalesByPayment = [
          { name: "Credit Card", value: 65, color: "#0088FE" },
          { name: "PayPal", value: 20, color: "#00C49F" },
          { name: "Bank Transfer", value: 10, color: "#FFBB28" },
          { name: "Cash on Delivery", value: 5, color: "#FF8042" },
        ];

        setOverviewStats(mockOverviewStats);
        setVisitorStats(mockVisitorStats);
        setProductStats(mockProductStats);
        setRatingStats(mockRatingStats);
        setSalesByPayment(mockSalesByPayment);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const downloadReport = () => {
    // Implementation for downloading reports
    alert("Report download functionality will be implemented here");
  };

  const renderChangeIndicator = (value) => {
    if (value > 0) {
      return <span className="text-green-600 flex items-center"><TrendingUp size={16} className="mr-1" />{value}%</span>;
    } else if (value < 0) {
      return <span className="text-red-600 flex items-center"><TrendingUp size={16} className="mr-1 transform rotate-180" />{Math.abs(value)}%</span>;
    }
    return <span className="text-gray-600">0%</span>;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNavbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 pb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Statistics & Metrics</h1>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            
            <button
              onClick={downloadReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              <span>Report</span>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCw size={30} className="text-blue-600" />
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">${overviewStats.totalSales?.toLocaleString()}</p>
                <div className="flex items-center text-sm">
                  {renderChangeIndicator(overviewStats.salesChange)}
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Orders</h3>
                  <div className="p-2 bg-green-100 rounded-full">
                    <ShoppingBag size={20} className="text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{overviewStats.totalOrders?.toLocaleString()}</p>
                <div className="flex items-center text-sm">
                  {renderChangeIndicator(overviewStats.ordersChange)}
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Customers</h3>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Users size={20} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">{overviewStats.totalCustomers?.toLocaleString()}</p>
                <div className="flex items-center text-sm">
                  {renderChangeIndicator(overviewStats.customersChange)}
                  <span className="text-gray-500 ml-2">vs. previous period</span>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-700">Avg. Order Value</h3>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <FileText size={20} className="text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-2">${overviewStats.averageOrderValue?.toFixed(2)}</p>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">Conversion rate: {overviewStats.conversionRate}%</span>
                </div>
              </motion.div>
            </div>
            
            {/* Visitors and Sales Chart */}
            <Card className="shadow-md">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl text-gray-800">Visitors & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={visitorStats}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="visitors"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Visitors"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Product Performance and Customer Ratings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card className="shadow-md">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl text-gray-800">Top Products</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productStats}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Customer Ratings */}
              <Card className="shadow-md">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800">Customer Ratings</CardTitle>
                    <div className="flex items-center">
                      <Star size={20} className="text-yellow-400 mr-1" />
                      <span className="text-lg font-medium">4.4</span>
                      <span className="text-sm text-gray-500 ml-1">/ 5</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4 mb-6">
                    {ratingStats.map((item) => (
                      <div key={item.rating} className="flex items-center">
                        <span className="text-sm text-gray-600 w-16">{item.rating}</span>
                        <div className="flex-1 mx-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{item.percentage}%</span>
                        <span className="text-sm text-gray-400 w-12">({item.count})</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Payment Methods */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Sales by Payment Method</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salesByPayment}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {salesByPayment.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminStatistics;
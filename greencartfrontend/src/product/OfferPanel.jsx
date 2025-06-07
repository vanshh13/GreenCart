import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { motion } from "framer-motion";
import { 
  Clock, 
  ArrowRight, 
  Carrot, 
  Truck, 
  Gift, 
  Badge, 
  Timer,
  ShoppingBasket,
  Leaf,
  Tag
} from "lucide-react";

const OfferPanel = () => {
  const offers = [
    {
      title: "Weekend Special",
      description: "20% off on fresh vegetables",
      tag: "Limited Time",
      validity: "2 days left",
      category: "Vegetables",
      color: "green",
      icon: <Carrot />,
      tagIcon: <Timer className="w-3 h-3 mr-1" />
    },
    {
      title: "Free Delivery",
      description: "On orders above ₹1000",
      tag: "Ongoing",
      validity: "No expiry",
      category: "Service",
      color: "blue",
      icon: <Truck />,
      tagIcon: <Badge className="w-3 h-3 mr-1" />
    },
    {
      title: "Bundle Deal",
      description: "Buy 2 Get 1 Free on fruits & Vegetable",
      tag: "Best Value",
      validity: "5 days left",
      category: "Fruits",
      color: "orange",
      icon: <Gift />,
      tagIcon: <Tag className="w-3 h-3 mr-1" />
    }
  ];

  const getColors = (color) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      orange: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 space-y-4"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-green-100 p-3 rounded-full"
          >
            <ShoppingBasket className="w-6 h-6 text-green-600" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Leaf className="w-5 h-5 text-green-500" />
          Current Offers
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className={`${getColors(offer.color)} border transition-all duration-300`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="p-2 bg-white/50 rounded-full"
                    >
                      {offer.icon}
                    </motion.div>
                    <CardTitle className="text-lg font-semibold">
                      {offer.title}
                    </CardTitle>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm flex items-center">
                    {offer.tagIcon}
                    {offer.tag}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="mb-4">{offer.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {offer.validity}
                  </div>
                  <motion.button 
                    className="flex items-center hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default OfferPanel;
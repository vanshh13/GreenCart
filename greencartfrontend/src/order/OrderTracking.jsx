import React from 'react';
import { Check, Truck, Package, ShoppingBag } from 'lucide-react';

const OrderTracking = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState({
    status: 'in_transit',
    steps: [
      { id: 'ordered', label: 'Order Placed', date: '2024-02-08', completed: true },
      { id: 'packed', label: 'Packed', date: '2024-02-08', completed: true },
      { id: 'shipped', label: 'Shipped', date: '2024-02-09', completed: true },
      { id: 'in_transit', label: 'In Transit', date: '2024-02-09', completed: false },
      { id: 'delivered', label: 'Delivered', date: null, completed: false }
    ]
  });

  const getStatusIcon = (step) => {
    switch (step.id) {
      case 'ordered':
        return <ShoppingBag className="h-6 w-6" />;
      case 'packed':
        return <Package className="h-6 w-6" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-6 w-6" />;
      case 'delivered':
        return <Check className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Status</h2>
          
          {/* Order Info */}
          <div className="mb-8">
            <p className="text-gray-600">Order ID: {orderId}</p>
            <p className="text-gray-600">Expected Delivery: Feb 10, 2024</p>
          </div>

          {/* Status Timeline */}
          <div className="relative">
            {orderStatus.steps.map((step, index) => (
              <div key={step.id} className="flex mb-8 last:mb-0">
                {/* Status Icon */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  step.completed ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'
                }`}>
                  <div className={step.completed ? 'text-green-600' : 'text-gray-400'}>
                    {getStatusIcon(step)}
                  </div>
                  {index < orderStatus.steps.length - 1 && (
                    <div className={`absolute w-0.5 h-full top-12 left-1/2 transform -translate-x-1/2 ${
                      step.completed ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* Status Details */}
                <div className="ml-4 flex-1">
                  <h3 className={`font-semibold ${
                    step.completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </h3>
                  {step.date && (
                    <p className="text-sm text-gray-500">
                      {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/order-details/order/${orderId}`)
      .then(response => setOrderDetail(response.data))
      .catch(error => console.error("Error fetching order details:", error));
  }, [orderId]);

  if (!orderDetail) return <p>Loading order details...</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Order Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Order ID:</h3>
            <p>{orderDetail.order}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Price:</h3>
            <p>${orderDetail.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Final Price:</h3>
            <p>${orderDetail.finalPrice.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Delivery Status:</h3>
            <p>{orderDetail.deliveryStatus}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Delivery Address:</h3>
            {orderDetail.deliveryAddress ? (
              <p>
                {orderDetail.deliveryAddress.streetOrSociety}, {orderDetail.deliveryAddress.cityVillage}, {orderDetail.deliveryAddress.state} - {orderDetail.deliveryAddress.pincode}
              </p>
            ) : (
              <p>No address found</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailPage;

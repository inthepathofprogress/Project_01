import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { orderAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Orders() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(user!.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: any = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      PROCESSING: 'primary',
      SHIPPED: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const statusColors: any = {
      PENDING: 'warning',
      COMPLETED: 'success',
      FAILED: 'danger',
      REFUNDED: 'info',
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Layout>
        <Container className="py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-5">
        <h1 className="mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <h4>No orders yet</h4>
              <p className="text-muted">Start shopping to place your first order!</p>
            </Card.Body>
          </Card>
        ) : (
          <div>
            {orders.map((order: any) => (
              <Card key={order.id} className="mb-4">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Order #{order.orderNumber}</strong>
                      <br />
                      <small className="text-muted">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="mb-2">
                        Status: {getStatusBadge(order.status)}
                      </div>
                      <div>
                        Payment: {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Table responsive borderless className="mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item.productName}</td>
                          <td>${item.price}</td>
                          <td>{item.quantity}</td>
                          <td>${item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <hr />

                  <div className="row">
                    <div className="col-md-6">
                      <h6>Shipping Address:</h6>
                      <p className="text-muted mb-0">
                        {order.shippingAddress}
                        <br />
                        {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                        <br />
                        {order.shippingCountry}
                      </p>
                    </div>
                    <div className="col-md-6 text-end">
                      <h6>Payment Method:</h6>
                      <p className="text-muted mb-2">{order.paymentMethod?.replace('_', ' ')}</p>
                      <h4>Total: ${order.totalAmount}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { cartAPI, orderAPI, paymentAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Checkout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await cartAPI.getCart(user!.id);
      setCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Create order
      const orderData = {
        userId: user!.id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingZipCode: shippingInfo.zipCode,
        shippingCountry: shippingInfo.country,
        paymentMethod: paymentInfo.paymentMethod,
      };

      const orderResponse = await orderAPI.createOrder(orderData);
      const order = orderResponse.data;

      // Process payment
      const paymentData = {
        orderId: order.id,
        userId: user!.id,
        amount: cart.totalAmount,
        paymentMethod: paymentInfo.paymentMethod,
        cardNumber: paymentInfo.cardNumber.slice(-4), // Store only last 4 digits
        cardHolderName: paymentInfo.cardHolderName,
      };

      const paymentResponse = await paymentAPI.processPayment(paymentData);
      const payment = paymentResponse.data;

      // Update order payment status
      await orderAPI.updateStatus(order.id, payment.status);

      if (payment.status === 'COMPLETED') {
        // Clear cart
        await cartAPI.clearCart(user!.id);

        // Redirect to success page
        router.push(`/order-success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
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

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <Layout>
      <Container className="py-5">
        <h1 className="mb-4">Checkout</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handlePlaceOrder}>
          <Row>
            <Col md={8}>
              {/* Shipping Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Shipping Information</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Address *</Form.Label>
                    <Form.Control
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, city: e.target.value })
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State *</Form.Label>
                        <Form.Control
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, state: e.target.value })
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Zip Code *</Form.Label>
                        <Form.Control
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Country *</Form.Label>
                        <Form.Control
                          type="text"
                          value={shippingInfo.country}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, country: e.target.value })
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Payment Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Payment Information (Test Mode)</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method *</Form.Label>
                    <Form.Select
                      value={paymentInfo.paymentMethod}
                      onChange={(e) =>
                        setPaymentInfo({ ...paymentInfo, paymentMethod: e.target.value })
                      }
                    >
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="DEBIT_CARD">Debit Card</option>
                      <option value="NET_BANKING">Net Banking</option>
                      <option value="UPI">UPI</option>
                      <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    </Form.Select>
                  </Form.Group>

                  {paymentInfo.paymentMethod !== 'CASH_ON_DELIVERY' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Number *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) =>
                            setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                          }
                          required
                        />
                        <Form.Text className="text-muted">
                          This is a test payment. Use any 16-digit number.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Cardholder Name *</Form.Label>
                        <Form.Control
                          type="text"
                          value={paymentInfo.cardHolderName}
                          onChange={(e) =>
                            setPaymentInfo({ ...paymentInfo, cardHolderName: e.target.value })
                          }
                          required
                        />
                      </Form.Group>
                    </>
                  )}

                  <Alert variant="info">
                    <strong>Test Payment Gateway:</strong> This is a simulated payment with a
                    90% success rate. If payment fails, simply try again.
                  </Alert>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <div>
                        <div>{item.productName}</div>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <div>${item.subtotal}</div>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <strong>Subtotal:</strong>
                    <span>${cart.totalAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <strong>Shipping:</strong>
                    <span className="text-success">FREE</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <h5>${cart.totalAmount}</h5>
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </Layout>
  );
}


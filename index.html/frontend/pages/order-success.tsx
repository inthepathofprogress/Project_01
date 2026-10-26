import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId, orderNumber } = router.query;

  return (
    <Layout>
      <Container className="py-5">
        <div className="text-center">
          <FaCheckCircle size={80} className="text-success mb-4" />
          <h1 className="mb-4">Order Placed Successfully!</h1>

          <Card className="mx-auto" style={{ maxWidth: '600px' }}>
            <Card.Body className="p-5">
              <h4 className="mb-4">Thank you for your order</h4>

              <div className="mb-4">
                <p className="text-muted mb-2">Order Number:</p>
                <h5>{orderNumber}</h5>
              </div>

              <Alert variant="success" className="mb-4">
                <strong>Payment Successful!</strong>
                <br />
                Your payment has been processed successfully.
              </Alert>

              <p className="text-muted mb-4">
                We've sent a confirmation email with your order details.
                You can track your order status from your orders page.
              </p>

              <div className="d-grid gap-2">
                <Link href={`/orders`} passHref>
                  <Button variant="primary" size="lg">
                    View My Orders
                  </Button>
                </Link>
                <Link href="/products" passHref>
                  <Button variant="outline-primary">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </Layout>
  );
}


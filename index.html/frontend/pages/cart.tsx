import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Container, Card, Button, Table, Form } from 'react-bootstrap';
import { cartAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Cart() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const response = await cartAPI.updateQuantity(user!.id, productId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const response = await cartAPI.removeItem(user!.id, productId);
      setCart(response.data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart(user!.id);
        loadCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
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
    return (
      <Layout>
        <Container className="py-5 text-center">
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Start shopping to add items to your cart</p>
          <Link href="/products" passHref>
            <Button variant="primary">Browse Products</Button>
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Shopping Cart</h1>
          <Button variant="outline-danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <Card>
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.productImage || 'https://via.placeholder.com/80'}
                          alt={item.productName}
                          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                          className="me-3"
                        />
                        <strong>{item.productName}</strong>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <div className="d-flex align-items-center" style={{ width: '120px' }}>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, parseInt(e.target.value) || 1)
                          }
                          className="mx-2 text-center"
                          style={{ width: '60px' }}
                          min="1"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td>${item.subtotal}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end">
              <h4>Total: ${cart.totalAmount}</h4>
            </div>
          </Card.Body>
        </Card>

        <div className="text-end mt-4">
          <Link href="/products" passHref>
            <Button variant="outline-primary" className="me-2">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/checkout" passHref>
            <Button variant="primary">Proceed to Checkout</Button>
          </Link>
        </div>
      </Container>
    </Layout>
  );
}


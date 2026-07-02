import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { productAPI } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAllProducts({ activeOnly: true });
      setProducts(response.data.slice(0, 6)); // Show only 6 featured products
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="hero-section text-center">
        <Container>
          <h1 className="display-3 fw-bold mb-4">Welcome to Suvida</h1>
          <p className="lead mb-4">
            Discover amazing products at unbeatable prices
          </p>
          <Link href="/products" passHref>
            <Button variant="light" size="lg">
              Shop Now
            </Button>
          </Link>
        </Container>
      </div>

      <Container>
        <h2 className="text-center mb-5">Featured Products</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row>
            {products.map((product: any) => (
              <Col md={4} key={product.id} className="mb-4">
                <Card className="product-card h-100">
                  <Card.Img
                    variant="top"
                    src={
                      product.imageUrl ||
                      `https://via.placeholder.com/300x200?text=${product.name}`
                    }
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {product.description?.substring(0, 100)}...
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="text-primary mb-0">
                          ${product.price}
                        </h5>
                        <Link href={`/products/${product.id}`} passHref>
                          <Button variant="primary">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-5 mb-5">
          <Link href="/products" passHref>
            <Button variant="primary" size="lg">
              View All Products
            </Button>
          </Link>
        </div>

        <Row className="mt-5 mb-5">
          <Col md={4} className="text-center">
            <div className="mb-3">
              <h1 className="text-primary">🚚</h1>
            </div>
            <h5>Free Shipping</h5>
            <p className="text-muted">On orders over $50</p>
          </Col>
          <Col md={4} className="text-center">
            <div className="mb-3">
              <h1 className="text-primary">🔒</h1>
            </div>
            <h5>Secure Payment</h5>
            <p className="text-muted">100% secure transactions</p>
          </Col>
          <Col md={4} className="text-center">
            <div className="mb-3">
              <h1 className="text-primary">↩️</h1>
            </div>
            <h5>Easy Returns</h5>
            <p className="text-muted">30-day return policy</p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}


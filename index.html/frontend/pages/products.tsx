import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { productAPI, cartAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, [category, searchTerm]);

  const loadProducts = async () => {
    try {
      const params: any = { activeOnly: true };
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;

      const response = await productAPI.getAllProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: any) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await cartAPI.addItem(user!.id, {
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        quantity: 1,
      });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  return (
    <Layout>
      <Container className="py-5">
        <h1 className="mb-4">Products</h1>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center">
            <p>No products found.</p>
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
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-primary mb-0">
                          ${product.price}
                        </h5>
                        <small className="text-muted">
                          Stock: {product.stockQuantity}
                        </small>
                      </div>
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          onClick={() => addToCart(product)}
                          disabled={product.stockQuantity === 0}
                        >
                          {product.stockQuantity === 0
                            ? 'Out of Stock'
                            : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Layout>
  );
}


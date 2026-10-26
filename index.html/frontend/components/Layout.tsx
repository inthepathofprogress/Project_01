import React from 'react';
import Link from 'next/link';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Link href="/" passHref legacyBehavior>
            <Navbar.Brand>Suvida</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link>Home</Nav.Link>
              </Link>
              <Link href="/products" passHref legacyBehavior>
                <Nav.Link>Products</Nav.Link>
              </Link>
              {isAdmin && (
                <Link href="/admin" passHref legacyBehavior>
                  <Nav.Link>Admin</Nav.Link>
                </Link>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Link href="/cart" passHref legacyBehavior>
                    <Nav.Link>
                      <FaShoppingCart /> Cart
                    </Nav.Link>
                  </Link>
                  <NavDropdown
                    title={
                      <>
                        <FaUser /> {user?.firstName}
                      </>
                    }
                    id="user-dropdown"
                  >
                    <Link href="/profile" passHref legacyBehavior>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </Link>
                    <Link href="/orders" passHref legacyBehavior>
                      <NavDropdown.Item>My Orders</NavDropdown.Item>
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link>Login</Nav.Link>
                  </Link>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link>Register</Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>{children}</main>

      <footer className="footer">
        <Container>
          <div className="row">
            <div className="col-md-4">
              <h5>Suvida E-Commerce</h5>
              <p>Your one-stop shop for all your needs.</p>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href="/about" className="text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p>Email: support@suvida.com</p>
              <p>Phone: +1 234 567 8900</p>
            </div>
          </div>
          <hr className="bg-white" />
          <p className="text-center mb-0">
            © 2024 Suvida. All rights reserved. | College Project
          </p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;


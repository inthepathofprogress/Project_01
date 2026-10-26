-- Demo User Data for Suvida E-Commerce
-- Run these SQL commands after all services are started

-- Connect to user database
\c suvida_users;

-- Insert Admin User (password: admin123)
-- BCrypt hash for 'admin123': $2a$10$8X9XMx0UqX4qX1qX2qX3qX4qX5qX6qX7qX8qX9qX0qX
-- Note: You need to generate the actual BCrypt hash or register through the application

-- Example: Register admin user through API
-- POST http://localhost:8080/api/users/register
-- {
--   "email": "admin@suvida.com",
--   "password": "admin123",
--   "firstName": "Admin",
--   "lastName": "User",
--   "phone": "+1234567890",
--   "address": "123 Admin Street",
--   "city": "New York",
--   "state": "NY",
--   "zipCode": "10001",
--   "country": "USA"
-- }

-- After registration, update the role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@suvida.com';

-- Insert Demo User (password: user123)
-- POST http://localhost:8080/api/users/register
-- {
--   "email": "user@suvida.com",
--   "password": "user123",
--   "firstName": "John",
--   "lastName": "Doe",
--   "phone": "+1234567891",
--   "address": "456 User Avenue",
--   "city": "Los Angeles",
--   "state": "CA",
--   "zipCode": "90001",
--   "country": "USA"
-- }

-- Verify users
SELECT id, email, first_name, last_name, role, active FROM users;


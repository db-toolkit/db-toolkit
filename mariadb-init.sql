-- Sample tables for MariaDB testing

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(50)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (username, email) VALUES
  ('john_doe', 'john@example.com'),
  ('jane_smith', 'jane@example.com'),
  ('bob_wilson', 'bob@example.com');

INSERT INTO products (name, price, stock, category) VALUES
  ('Laptop', 999.99, 10, 'Electronics'),
  ('Mouse', 29.99, 50, 'Electronics'),
  ('Desk Chair', 199.99, 15, 'Furniture'),
  ('Monitor', 299.99, 20, 'Electronics');

INSERT INTO orders (user_id, total, status) VALUES
  (1, 1029.98, 'completed'),
  (2, 199.99, 'pending'),
  (1, 299.99, 'completed');

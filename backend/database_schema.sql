-- Create Database
CREATE DATABASE IF NOT EXISTS accolade_ecommerce;
USE accolade_ecommerce;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  image VARCHAR(500),
  rating DECIMAL(3, 1) DEFAULT 0,
  reviews INT DEFAULT 0,
  badge VARCHAR(50),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert Sample Categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Latest gadgets and electronic devices'),
('Fashion', 'Stylish clothing and accessories'),
('Books', 'Best sellers and classic literature'),
('Accessories', 'Bags, watches, and other accessories');

-- Insert Sample Products
INSERT INTO products (name, description, price, category_id, image, rating, reviews, badge, stock) VALUES
('iPhone 15 Pro Max', 'The most powerful iPhone ever with A17 Pro chip, stunning titanium design, and the most advanced camera system. Experience unprecedented performance with the Action button, USB-C, and exceptional battery life.', 80000, 1, 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=600&q=80', 4.5, 245, 'New', 50),
('Nike Air Max 2024', 'Step up your sneaker game with the Nike Air Max 2024. Featuring visible Air cushioning, breathable mesh upper, and iconic Nike design. Perfect for both athletic activities and casual wear.', 6000, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 4, 189, 'Sale', 100),
('Apple Watch Series 9', 'Your ultimate health and fitness companion. Features advanced health sensors, ECG, blood oxygen monitoring, sleep tracking, and seamless integration with your iPhone. Stay connected and healthy.', 4500, 1, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80', 4.2, 312, 'Trending', 75),
('Premium Leather Backpack', 'Handcrafted genuine leather backpack with spacious compartments. Perfect for work, travel, or daily use. Features padded laptop sleeve, water-resistant coating, and adjustable straps for maximum comfort.', 2000, 4, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 4, 156, NULL, 120),
('Effective Java Programming Book', 'Master Java programming with this comprehensive guide covering best practices, design patterns, and advanced techniques. Perfect for beginners and experienced developers.', 900, 3, 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=600&q=80', 4.3, 89, NULL, 200),
('Sony WH-1000XM5 Headphones', 'Industry-leading noise canceling with premium sound quality. Features 30-hour battery life, adaptive sound control, and seamless multi-device connectivity.', 24000, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 4.6, 534, 'Trending', 40),
('Summer Cotton T-Shirt', 'Comfortable and breathable cotton t-shirt perfect for summer. Available in multiple colors and sizes. Machine washable and long-lasting.', 500, 2, 'https://images.unsplash.com/photo-1618573357944-2bff29b97d49?auto=format&fit=crop&w=600&q=80', 3.8, 234, 'Sale', 300),
('Digital Marketing Guide', 'Complete guide to digital marketing strategies including SEO, SEM, social media, and content marketing. Learn from industry experts.', 650, 3, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', 4.1, 156, NULL, 150);

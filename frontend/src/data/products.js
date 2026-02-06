// Centralized product data with accurate images matching product names
export const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 80000,
    rating: 4.5,
    category: "Electronics",
    reviews: 245,
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&w=600&q=80",
    badge: "New",
    description: "The most powerful iPhone ever with A17 Pro chip, stunning titanium design, and the most advanced camera system. Experience unprecedented performance with the Action button, USB-C, and exceptional battery life."
  },
  {
    id: 2,
    name: "Nike Air Max 2024",
    price: 6000,
    rating: 4,
    category: "Fashion",
    reviews: 189,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    badge: "Sale",
    description: "Step up your sneaker game with the Nike Air Max 2024. Featuring visible Air cushioning, breathable mesh upper, and iconic Nike design. Perfect for both athletic activities and casual wear."
  },
  {
    id: 3,
    name: "Apple Watch Series 9",
    price: 4500,
    rating: 4.2,
    category: "Electronics",
    reviews: 312,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    description: "Your ultimate health and fitness companion. Features advanced health sensors, ECG, blood oxygen monitoring, sleep tracking, and seamless integration with your iPhone. Stay connected and healthy."
  },
  {
    id: 4,
    name: "Premium Leather Backpack",
    price: 2000,
    rating: 4,
    category: "Accessories",
    reviews: 156,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted genuine leather backpack with spacious compartments. Perfect for work, travel, or daily use. Features padded laptop sleeve, water-resistant coating, and adjustable straps for maximum comfort."
  },
  {
    id: 5,
    name: "Effective Java Programming Book",
    price: 900,
    rating: 4.3,
    category: "Books",
    reviews: 87,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    description: "Master the Java programming language with best practices and proven patterns. This comprehensive guide covers advanced Java techniques, design patterns, and real-world applications for professional developers."
  },
  {
    id: 6,
    name: "Samsung Galaxy S24 Ultra",
    price: 75000,
    rating: 4.6,
    category: "Electronics",
    reviews: 523,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    description: "Unleash the power of Galaxy AI with the S24 Ultra. Featuring 200MP camera, S Pen, stunning 6.8\" display, and all-day battery. Capture incredible photos and videos in any lighting condition."
  },
  {
    id: 7,
    name: "Adidas Ultraboost Running Shoes",
    price: 5500,
    rating: 4.1,
    category: "Fashion",
    reviews: 234,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
    description: "Experience endless energy with every step. Boost technology provides incredible energy return, Primeknit upper for adaptive support, and Continental rubber outsole for superior grip in all conditions."
  },
  {
    id: 8,
    name: "Genuine Leather Wallet",
    price: 1200,
    rating: 3.9,
    category: "Accessories",
    reviews: 112,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    description: "Slim, elegant leather wallet with RFID protection. Multiple card slots, cash compartment, and ID window. Crafted from premium full-grain leather that ages beautifully. Perfect gift for any occasion."
  },
  {
    id: 9,
    name: "Full-Stack Web Development Guide",
    price: 1200,
    rating: 4.4,
    category: "Books",
    reviews: 95,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    description: "Complete roadmap to becoming a full-stack developer. Covers HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Includes hands-on projects and real-world applications."
  },
  {
    id: 10,
    name: "Sony WH-1000XM5 Headphones",
    price: 24990,
    rating: 4.7,
    category: "Electronics",
    reviews: 892,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    badge: "New",
    description: "Industry-leading noise cancellation with premium sound quality. 30-hour battery life, multipoint connection, speak-to-chat technology, and supreme comfort for all-day listening. Perfect for travel and work."
  },
  {
    id: 11,
    name: "Levi's Classic Denim Jacket",
    price: 4200,
    rating: 4.3,
    category: "Fashion",
    reviews: 456,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    description: "Timeless denim jacket that never goes out of style. Made from durable cotton denim with classic trucker styling. Perfect for layering in any season. Available in multiple washes."
  },
  {
    id: 12,
    name: "Ray-Ban Aviator Sunglasses",
    price: 8500,
    rating: 4.5,
    category: "Accessories",
    reviews: 678,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    badge: "Sale",
    description: "Iconic aviator style with crystal-clear lenses and UV protection. Lightweight metal frame for all-day comfort. A timeless classic that complements any outfit and face shape."
  }
];

// Helper function to get product by ID
export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id)) || null;
};

// Helper function to search products
export const searchProducts = (query) => {
  if (!query || query.trim() === '') return products;
  
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
};

// Helper function to filter by category
export const filterByCategory = (category) => {
  if (!category) return products;
  return products.filter(p => p.category === category);
};

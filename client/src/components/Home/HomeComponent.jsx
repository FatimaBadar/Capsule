import React, { useState, useEffect } from 'react';
import './Home.css';

const HomeComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sample products data
  const popularProducts = [
    { id: 1, name: 'Timeless Classic Collection', category: 'Work & Office', price: '$124.90 - $134.90', image: '/img-08-a-300x300.jpg' },
    { id: 2, name: 'Bohemian Rhapsody Attire', category: 'Casual', price: '$145.50 - $155.50', image: '/img-06-a-black-300x300.jpg' },
    { id: 3, name: 'Midnight Gala Maxi Dress', category: 'Evening Dresses', price: '$175.00 - $180.00', image: '/img-05-a-white-300x300.jpg' },
    { id: 4, name: 'Power Suit Ensemble', category: 'Casual', price: '$135.50 - $175.50', image: '/img-01-a-300x300.jpg' },
  ];

  const newProducts = [
    { id: 5, name: 'Professional Pinstripe Blazer', category: 'Activewear', price: '$109.99', image: '/img-02-a-300x300.jpg' },
    { id: 6, name: 'Relaxed Fit Joggers', category: 'Work & Office', price: '$250.00', image: '/img-07-a-300x300.jpg' },
    { id: 7, name: 'Urban Chic Ensemble', category: 'Evening Dresses', price: '$224.95', image: '/img-04-a-300x300.jpg' },
    { id: 8, name: 'Weekend Wanderlust Wardrobe', category: 'Activewear', price: '$119.95', image: '/img-03-a-300x300.jpg' },
  ];

  const features = [
    { icon: '🔒', title: 'Secure Payments', desc: 'Shop with confidence knowing that your transactions are safeguarded.' },
    { icon: '🚚', title: 'Free Shipping', desc: 'Shopping with no extra charges – savor the liberty of complimentary shipping on every order.' },
    { icon: '↩️', title: 'Easy Returns', desc: 'With our hassle-free Easy Returns, changing your mind has never been more convenient.' },
    { icon: '📍', title: 'Order Tracking', desc: 'Stay in the loop with our Order Tracking feature – from checkout to your doorstep.' },
  ];

  return (
    <div className="page-wrapper">

      {/* Hero Section */}
      <section className="hero-section home-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h6 className="hero-subtitle">OOTD & Everyday</h6>
            <h1>Capsule: Your Wardrobe, Made Smarter</h1>
            <p>Your smart wardrobe for organizing clothes, generating outfits, and promoting sustainable fashion practices.</p>
            <button className="hero-button">View Collection</button>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Most Popular</h2>
          <div className="products-grid">
            {popularProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button className="add-to-cart-btn">
                    <span className="cart-icon">🛍️</span>
                  </button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">⭐⭐⭐⭐⭐</div>
                  <span className="product-price">{product.price}</span>
                  <div className="product-options">
                    <div className="size-options">
                      <span>L</span><span>M</span><span>S</span><span>XL</span><span>XS</span>
                    </div>
                  </div>
                  <button className="select-options-btn">Select options</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bag Collection CTA */}
      <section className="cta-section bag-cta">
        <div className="cta-overlay">
          <div className="cta-content">
            <img src="/bg-03-b.jpg" alt="Bag Collection" className="cta-image" />
            <h3>Explore our exquisite Bag Collection now!</h3>
            <button className="cta-button">View Collection</button>
          </div>
        </div>
      </section>

      {/* Work & Office Section */}
      <section className="work-office-section">
        <div className="work-office-content">
          <h6 className="section-subtitle">Work & Office Attire</h6>
          <h2>Professional pinstripe blazers collection</h2>
          <p>Elevate your workwear with our Professional Pinstripe Blazers Collection, where tailored sophistication meets modern confidence for a powerfully polished office look.</p>
          <button className="cta-button">Shop Now</button>
        </div>
      </section>

      {/* Fashion Discovery CTA */}
      <section className="discovery-section">
        <div className="discovery-overlay">
          <div className="discovery-content">
            <h3>Discover the allure of fashion reinvented!</h3>
            <p>Dive into a world of style with our latest collection! Shop now and redefine your wardrobe narrative!</p>
            <button className="cta-button">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Newest Products */}
      <section className="products-section newest-products">
        <div className="container">
          <h2 className="section-title">Newest Products</h2>
          <div className="products-grid">
            {newProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button className="add-to-cart-btn">
                    <span className="cart-icon">🛍️</span>
                  </button>
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">⭐⭐⭐⭐⭐</div>
                  <span className="product-price">{product.price}</span>
                  <button className="add-to-cart-simple">Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <h4>"Capsule is my fashion sanctuary! The curated collection effortlessly blends chic trends with timeless elegance, making every purchase a delightful discovery."</h4>
          <h6>Sarah M., Devoted FemmeWardrobe Fan</h6>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="final-cta-overlay">
          <div className="final-cta-content">
            <h6>Explore</h6>
            <h2>Elevate your wardrobe, embrace timeless style!</h2>
            <p>Explore our collections today and experience the joy of fashion. Shop now for the epitome of chic sophistication!</p>
            <button className="cta-button">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <p>Copyright © 2025 Capsule</p>
        </div>
      </footer>

      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
    </div>
  );
};

export default HomeComponent;
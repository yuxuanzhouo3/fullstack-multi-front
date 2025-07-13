import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/Home.module.css";

const products = [
  {
    id: 'rent',
    name: 'MornRent',
    description: 'Complete rental management platform with property listings, tenant management, and payment processing.',
    url: '/rent',
    domain: 'rent.mornhub.net',
    color: '#3B82F6',
    icon: '🏠'
  },
  {
    id: 'job',
    name: 'MornJob',
    description: 'Professional job board and recruitment platform connecting employers with top talent.',
    url: '/job',
    domain: 'job.mornhub.net',
    color: '#10B981',
    icon: '💼'
  },
  {
    id: 'social',
    name: 'MornSocial',
    description: 'Modern social networking platform with real-time messaging and community features.',
    url: '/social',
    domain: 'social.mornhub.net',
    color: '#8B5CF6',
    icon: '👥'
  },
  {
    id: 'deepfake_detector',
    name: 'Deepfake Detector',
    description: 'AI-powered deepfake detection system for media authenticity verification.',
    url: '/deepfake',
    domain: 'deepfake.mornhub.net',
    color: '#EF4444',
    icon: '🔍'
  },
  {
    id: 'accelerator',
    name: 'USA-China Accelerator',
    description: 'High-speed network acceleration service for USA-China connectivity.',
    url: '/accelerator',
    domain: 'accelerator.mornhub.net',
    color: '#F59E0B',
    icon: '🚀'
  }
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  return (
    <>
      <Head>
        <title>MornHub - Multi-Product Platform</title>
        <meta name="description" content="Access all MornHub products from one central dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>🌟 MornHub</h1>
            <p className={styles.subtitle}>Multi-Product Platform Dashboard</p>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.intro}>
            <h2>Welcome to MornHub</h2>
            <p>Access all our products and services from one central location. All products are fully functional and isolated.</p>
            
            {/* Status notice */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <strong>✅ All Products Working!</strong> Each product has its own dedicated page with unique features and styling.
            </div>
          </div>

          <div className={styles.productGrid}>
            {products.map((product) => (
              <div 
                key={product.id} 
                className={styles.productCard}
                style={{ borderColor: product.color }}
                onMouseEnter={() => setSelectedProduct(product)}
                onMouseLeave={() => setSelectedProduct(null)}
              >
                <div className={styles.productIcon} style={{ backgroundColor: product.color }}>
                  {product.icon}
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                
                <div className={styles.productLinks}>
                  <a 
                    href={product.url} 
                    className={styles.productButton}
                    style={{ backgroundColor: product.color }}
                  >
                    🚀 Launch App
                  </a>
                  <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Direct access: mornhub.net{product.url}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {selectedProduct && (
            <div className={styles.productPreview}>
              <h3>Quick Access: {selectedProduct.name}</h3>
              <p>{selectedProduct.description}</p>
              <div className={styles.quickLinks}>
                <a href={selectedProduct.url} className={styles.quickLink}>
                  🚀 Launch {selectedProduct.name} →
                </a>
              </div>
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; 2024 MornHub. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="/api/health" target="_blank" rel="noopener noreferrer">System Status</a>
              <a href="https://github.com/mornhub">GitHub</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

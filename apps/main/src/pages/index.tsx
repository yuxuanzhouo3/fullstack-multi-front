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
    url: '/deepfake-detector',
    domain: 'deepfake-detector.mornhub.net',
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
            <p>Access all our products and services from one central location. Choose a product below to get started.</p>
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
                    Open App
                  </a>
                  <a 
                    href={`https://${product.domain}`}
                    className={styles.domainLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.domain}
                  </a>
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
                  Launch App →
                </a>
                <a 
                  href={`https://${selectedProduct.domain}`}
                  className={styles.quickLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Domain →
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

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
    icon: '🏠',
    status: 'working'
  },
  {
    id: 'job',
    name: 'MornJob',
    description: 'Professional job board and recruitment platform connecting employers with top talent.',
    url: '/job',
    domain: 'job.mornhub.net',
    color: '#10B981',
    icon: '💼',
    status: 'working'
  },
  {
    id: 'social',
    name: 'MornSocial',
    description: 'Modern social networking platform with real-time messaging and community features.',
    url: '/social',
    domain: 'social.mornhub.net',
    color: '#8B5CF6',
    icon: '👥',
    status: 'working'
  },
  {
    id: 'deepfake',
    name: 'Deepfake Detector',
    description: 'AI-powered deepfake detection system for media authenticity verification.',
    url: '/deepfake',
    domain: 'deepfake.mornhub.net',
    color: '#EF4444',
    icon: '🔍',
    status: 'working'
  },
  {
    id: 'accelerator',
    name: 'USA-China Accelerator',
    description: 'High-speed network acceleration service for USA-China connectivity.',
    url: '/accelerator',
    domain: 'accelerator.mornhub.net',
    color: '#F59E0B',
    icon: '🚀',
    status: 'working'
  }
];

type Product = typeof products[0];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>MornHub - Multi-Product Platform</title>
        <meta name="description" content="Access all MornHub products from one central dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
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
            
            {/* Status Notice */}
            <div className={styles.statusNotice}>
              <h3>✅ All Products Working!</h3>
              <p><strong>Main Domain Routes:</strong> All products are fully functional via <code>mornhub.net/{'{product}'}</code></p>
              <p><strong>Subdomain Status:</strong> Currently experiencing Vercel platform routing issues</p>
              <p><strong>Recommended:</strong> Use the "Open App" buttons below for the best experience</p>
            </div>
          </div>

          <div className={styles.productGrid}>
            {products.map((product) => (
              <div 
                key={product.id} 
                className={styles.productCard}
                style={{ borderColor: product.color }}
                onClick={() => setSelectedProduct(product)}
              >
                <div 
                  className={styles.productIcon}
                  style={{ backgroundColor: product.color }}
                >
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
                    ✅ Open App
                  </a>
                  <a 
                    href={`https://${product.domain}`} 
                    className={styles.domainLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: product.color }}
                  >
                    {product.domain}
                  </a>
                </div>
                <div className={styles.statusBadge}>
                  <span style={{ backgroundColor: product.status === 'working' ? '#10B981' : '#EF4444' }}>
                    {product.status === 'working' ? '✅ Working' : '❌ Issue'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Section */}
          <div className={styles.quickAccess}>
            <h3>🚀 Quick Access Links</h3>
            <div className={styles.quickLinks}>
              <a href="/rent" className={styles.quickLink} style={{ backgroundColor: '#3B82F6' }}>
                🏠 MornRent
              </a>
              <a href="/job" className={styles.quickLink} style={{ backgroundColor: '#10B981' }}>
                💼 MornJob
              </a>
              <a href="/social" className={styles.quickLink} style={{ backgroundColor: '#8B5CF6' }}>
                👥 MornSocial
              </a>
              <a href="/deepfake" className={styles.quickLink} style={{ backgroundColor: '#EF4444' }}>
                🔍 Deepfake Detector
              </a>
              <a href="/accelerator" className={styles.quickLink} style={{ backgroundColor: '#F59E0B' }}>
                🚀 Accelerator
              </a>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>© 2024 MornHub. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="/api/health" target="_blank" rel="noopener noreferrer">System Status</a>
              <a href="https://github.com/mornhub">GitHub</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

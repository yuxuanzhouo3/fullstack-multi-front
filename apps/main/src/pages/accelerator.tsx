import React from 'react';
import Head from 'next/head';

export default function AcceleratorDashboard() {
  return (
    <>
      <Head>
        <title>USA-China Accelerator - High-Speed Network</title>
        <meta name="description" content="High-speed network acceleration service for USA-China connectivity." />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <header style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>🚀 USA-China Accelerator</h1>
          <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            High-Speed Network Acceleration Service
          </p>
        </header>
        
        <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>⚡ Speed Boost</h3>
              <p>Accelerate your network connections between USA and China with our optimized routing technology.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Test Speed
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🌐 Global CDN</h3>
              <p>Access content faster with our distributed content delivery network spanning both regions.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Deploy CDN
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📊 Analytics</h3>
              <p>Monitor your network performance with real-time analytics and detailed connection metrics.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                View Analytics
              </button>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '2rem', 
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Accelerate Your Global Connections</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Experience lightning-fast connectivity between USA and China with our advanced network acceleration technology.
            </p>
            <button style={{
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Start Acceleration
            </button>
          </div>
        </main>
        
        <footer style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.8
        }}>
          <p>© 2024 USA-China Accelerator. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
} 
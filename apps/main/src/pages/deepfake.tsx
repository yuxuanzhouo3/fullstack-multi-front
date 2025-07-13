import React from 'react';
import Head from 'next/head';

export default function DeepfakeDetectorDashboard() {
  return (
    <>
      <Head>
        <title>Deepfake Detector - AI Media Verification</title>
        <meta name="description" content="AI-powered deepfake detection system for media authenticity verification." />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <header style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>🔍 Deepfake Detector</h1>
          <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            AI-Powered Media Authenticity Verification
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
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📸 Image Analysis</h3>
              <p>Upload images to detect AI-generated content, manipulated photos, and deepfake imagery.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Analyze Image
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🎥 Video Detection</h3>
              <p>Analyze videos for deepfake content, face swaps, and AI-generated video manipulation.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Analyze Video
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🔒 API Access</h3>
              <p>Integrate our detection API into your applications for real-time content verification.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Get API Key
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
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Protect Against Deepfakes</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Trust our advanced AI technology to detect and verify media authenticity in real-time.
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
              Start Detection
            </button>
          </div>
        </main>
        
        <footer style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.8
        }}>
          <p>© 2024 Deepfake Detector. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
} 
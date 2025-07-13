import React from 'react';
import Head from 'next/head';

export default function SocialDashboard() {
  return (
    <>
      <Head>
        <title>MornSocial - Modern Social Network</title>
        <meta name="description" content="Modern social networking platform with real-time messaging and community features." />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <header style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>👥 MornSocial</h1>
          <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Modern Social Networking Platform
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
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>💬 Real-time Chat</h3>
              <p>Connect with friends and family through instant messaging, voice calls, and video chats.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Start Chatting
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📱 Stories & Posts</h3>
              <p>Share your moments with photos, videos, and stories. Engage with content from your network.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Share Story
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🏘️ Communities</h3>
              <p>Join communities based on your interests, hobbies, and professional networks.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Explore Communities
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
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Ready to Connect?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Join millions of users who trust MornSocial to stay connected with friends, family, and communities.
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
              Join MornSocial
            </button>
          </div>
        </main>
        
        <footer style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.8
        }}>
          <p>© 2024 MornSocial. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
} 
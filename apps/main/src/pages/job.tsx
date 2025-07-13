import React from 'react';
import Head from 'next/head';

export default function JobDashboard() {
  return (
    <>
      <Head>
        <title>MornJob - Professional Job Board</title>
        <meta name="description" content="Professional job board and recruitment platform connecting employers with top talent." />
      </Head>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <header style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>💼 MornJob</h1>
          <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Professional Job Board & Recruitment Platform
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
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🔍 Job Search</h3>
              <p>Find your dream job with advanced search filters, AI-powered matching, and personalized recommendations.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Search Jobs
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🏢 Post Jobs</h3>
              <p>Employers can post job openings, manage applications, and find the perfect candidates for their teams.</p>
              <button style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Post a Job
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📊 Analytics</h3>
              <p>Track application performance, candidate engagement, and hiring metrics with detailed analytics.</p>
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
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Ready to Find Your Next Opportunity?</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Join thousands of professionals and companies who trust MornJob for their career and hiring needs.
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
              Get Started Today
            </button>
          </div>
        </main>
        
        <footer style={{ 
          padding: '2rem', 
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.8
        }}>
          <p>© 2024 MornJob. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
} 
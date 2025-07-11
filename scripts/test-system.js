#!/usr/bin/env node

// Multi-Tenant System Test Script
const http = require('http');
const https = require('https');

const BACKEND_PORT = process.env.BACKEND_PORT || 8000;

class SystemTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.apiUrl = `http://localhost:${BACKEND_PORT}`;
    this.testResults = [];
  }

  async testEndpoint(url, description) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;
      
      const req = protocol.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const result = {
            url,
            description,
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
          };
          this.testResults.push(result);
          console.log(`${result.success ? '✅' : '❌'} ${description} (${res.statusCode})`);
          resolve(result);
        });
      });

      req.on('error', (error) => {
        const result = {
          url,
          description,
          status: 0,
          success: false,
          error: error.message
        };
        this.testResults.push(result);
        console.log(`❌ ${description} (Connection failed: ${error.message})`);
        resolve(result);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        const result = {
          url,
          description,
          status: 0,
          success: false,
          error: 'Timeout'
        };
        this.testResults.push(result);
        console.log(`❌ ${description} (Timeout)`);
        resolve(result);
      });
    });
  }

  async runTests() {
    console.log('🧪 Testing Multi-Tenant System...\n');

    // Test Node.js server endpoints
    await this.testEndpoint(`${this.baseUrl}/health`, 'Node.js Server Health Check');
    await this.testEndpoint(`${this.baseUrl}/product-1`, 'Product-1 Frontend');
    await this.testEndpoint(`${this.baseUrl}/product-2`, 'Product-2 Frontend');
    await this.testEndpoint(`${this.baseUrl}/product-3`, 'Product-3 Frontend');
    await this.testEndpoint(`${this.baseUrl}/shared/styles/common.css`, 'Shared CSS');

    // Test Python backend endpoints
    await this.testEndpoint(`${this.apiUrl}/health`, 'Python Backend Health Check');
    await this.testEndpoint(`${this.apiUrl}/`, 'Python Backend Root');
    await this.testEndpoint(`${this.apiUrl}/docs`, 'API Documentation');

    // Test API endpoints (without auth)
    await this.testEndpoint(`${this.apiUrl}/api/shared/resources`, 'Shared Resources API');

    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    
    this.testResults.forEach(result => {
      const status = result.success ? 'PASS' : 'FAIL';
      console.log(`${status}: ${result.description}`);
    });

    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! System is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the services and try again.');
    }

    return this.testResults;
  }

  async testProductIsolation() {
    console.log('\n🔒 Testing Product Isolation...');
    
    // This would require actual authentication tokens
    // For now, we'll just test that different products are accessible
    const products = ['product-1', 'product-2', 'product-3', 'product-100'];
    
    for (const product of products) {
      await this.testEndpoint(`${this.baseUrl}/${product}`, `Product ${product} Access`);
    }
  }

  async testSharedResources() {
    console.log('\n📦 Testing Shared Resources...');
    
    const sharedResources = [
      '/shared/styles/common.css',
      '/shared/scripts/utils.js'
    ];
    
    for (const resource of sharedResources) {
      await this.testEndpoint(`${this.baseUrl}${resource}`, `Shared Resource: ${resource}`);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new SystemTester();
  
  tester.runTests()
    .then(() => tester.testProductIsolation())
    .then(() => tester.testSharedResources())
    .then(() => {
      console.log('\n✨ Testing completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = SystemTester; 
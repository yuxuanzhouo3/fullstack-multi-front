#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class AppGenerator {
  constructor() {
    this.appsDir = path.join(__dirname, '../apps');
    this.templates = {
      ecommerce: this.getEcommerceTemplate(),
      crm: this.getCrmTemplate(),
      project: this.getProjectTemplate(),
      analytics: this.getAnalyticsTemplate(),
      messaging: this.getMessagingTemplate(),
      fileManager: this.getFileManagerTemplate()
    };
  }

  getEcommerceTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PRODUCT_NAME}} - Multi-Tenant System</title>
    <link rel="stylesheet" href="/shared/styles/common.css">
    <style>
        .hero { background: linear-gradient(135deg, var(--primary-{{THEME}}), #1e40af); color: white; padding: var(--spacing-2xl) 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: var(--spacing-md); }
        .hero p { font-size: var(--font-size-lg); opacity: 0.9; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); margin: var(--spacing-2xl) 0; }
        .feature-card { text-align: center; padding: var(--spacing-lg); }
        .feature-icon { font-size: 3rem; margin-bottom: var(--spacing-md); }
    </style>
</head>
<body class="theme-{{THEME}}">
    <nav class="nav">
        <div class="container nav-container">
            <a href="#" class="nav-brand">{{PRODUCT_NAME}}</a>
            <ul class="nav-menu">
                <li><a href="#" class="nav-link">Dashboard</a></li>
                <li><a href="#" class="nav-link">Products</a></li>
                <li><a href="#" class="nav-link">Orders</a></li>
                <li><a href="#" class="nav-link">Customers</a></li>
                <li><a href="#" class="nav-link" id="logout-btn">Logout</a></li>
            </ul>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Welcome to {{PRODUCT_NAME}}</h1>
                <p>{{PRODUCT_DESCRIPTION}}</p>
            </div>
        </section>

        <div class="container">
            <div class="dashboard-grid">
                <div class="metric-card">
                    <div class="metric-value" id="total-sales">$0</div>
                    <div class="metric-label">Total Sales</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="total-orders">0</div>
                    <div class="metric-label">Total Orders</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="total-customers">0</div>
                    <div class="metric-label">Total Customers</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="growth-rate">0%</div>
                    <div class="metric-label">Growth Rate</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Recent Activity</h2>
                </div>
                <div id="activity-list">
                    <p>Loading recent activity...</p>
                </div>
            </div>

            <div class="features-grid">
                {{FEATURES_HTML}}
            </div>
        </div>
    </main>

    <script src="/shared/scripts/utils.js"></script>
    <script>
        class {{PRODUCT_CLASS}} {
            constructor() {
                this.utils = window.MultiTenantUtils;
                this.productId = '{{PRODUCT_ID}}';
                this.init();
            }

            async init() {
                try {
                    if (!this.utils.token) {
                        this.showLoginForm();
                        return;
                    }

                    const config = await this.utils.apiRequest('/config');
                    this.utils.applyTheme(config.product.theme);
                    await this.loadDashboardData();
                    this.setupEventListeners();
                } catch (error) {
                    this.utils.handleError(error, 'App initialization');
                }
            }

            async loadDashboardData() {
                try {
                    this.utils.showLoading('#activity-list');
                    const data = await this.utils.apiRequest('/data');
                    
                    document.getElementById('total-sales').textContent = this.utils.formatCurrency(data.dashboard.metrics.revenue);
                    document.getElementById('total-orders').textContent = data.dashboard.metrics.users;
                    document.getElementById('total-customers').textContent = Math.floor(data.dashboard.metrics.users * 0.8);
                    document.getElementById('growth-rate').textContent = data.dashboard.metrics.growth + '%';

                    const activityList = document.getElementById('activity-list');
                    activityList.innerHTML = data.dashboard.recent_activity
                        .map(activity => \`
                            <div class="flex justify-between items-center" style="padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--gray-200);">
                                <span>\${activity.action}</span>
                                <small style="color: var(--gray-500);">\${this.utils.formatDateTime(activity.timestamp)}</small>
                            </div>
                        \`).join('');
                } catch (error) {
                    this.utils.handleError(error, 'Loading dashboard data');
                } finally {
                    this.utils.hideLoading('#activity-list');
                }
            }

            setupEventListeners() {
                document.getElementById('logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.utils.logout();
                });

                this.utils.trackEvent('page_view', {
                    page: 'dashboard',
                    product: '{{PRODUCT_ID}}'
                });
            }

            showLoginForm() {
                document.body.innerHTML = \`
                    <div class="container" style="max-width: 400px; margin: 100px auto;">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="card-title">Login to {{PRODUCT_NAME}}</h2>
                            </div>
                            <form id="login-form">
                                <div class="form-group">
                                    <label class="form-label">Username</label>
                                    <input type="text" name="username" class="form-input" value="admin" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input type="password" name="password" class="form-input" value="password123" required>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                            </form>
                        </div>
                    </div>
                \`;

                document.getElementById('login-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    
                    try {
                        await this.utils.login(
                            formData.get('username'),
                            formData.get('password'),
                            this.productId
                        );
                        window.location.reload();
                    } catch (error) {
                        this.utils.showAlert('Login failed. Please try again.', 'error');
                    }
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new {{PRODUCT_CLASS}}();
        });
    </script>
</body>
</html>`;
  }

  getCrmTemplate() {
    return this.getEcommerceTemplate().replace(/{{PRODUCT_NAME}}/g, 'CRM System')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, 'Manage your customer relationships effectively')
      .replace(/{{FEATURES_HTML}}/g, `
        <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Contact Management</h3>
            <p>Organize and track customer information</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Lead Tracking</h3>
            <p>Convert prospects into customers</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Track performance and insights</p>
        </div>
      `);
  }

  getProjectTemplate() {
    return this.getEcommerceTemplate().replace(/{{PRODUCT_NAME}}/g, 'Project Management')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, 'Collaborate and manage projects efficiently')
      .replace(/{{FEATURES_HTML}}/g, `
        <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Task Management</h3>
            <p>Organize and track project tasks</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>Timeline</h3>
            <p>Visualize project schedules</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Collaboration</h3>
            <p>Team communication and sharing</p>
        </div>
      `);
  }

  getAnalyticsTemplate() {
    return this.getEcommerceTemplate().replace(/{{PRODUCT_NAME}}/g, 'Analytics Platform')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, 'Advanced data analytics and insights')
      .replace(/{{FEATURES_HTML}}/g, `
        <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Dashboard</h3>
            <p>Real-time data visualization</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Reports</h3>
            <p>Generate detailed analytics reports</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Metrics</h3>
            <p>Track key performance indicators</p>
        </div>
      `);
  }

  getMessagingTemplate() {
    return this.getEcommerceTemplate().replace(/{{PRODUCT_NAME}}/g, 'Messaging Platform')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, 'Real-time communication and collaboration')
      .replace(/{{FEATURES_HTML}}/g, `
        <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Messaging</h3>
            <p>Real-time chat and communication</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Stay updated with alerts</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Chat</h3>
            <p>Group and private conversations</p>
        </div>
      `);
  }

  getFileManagerTemplate() {
    return this.getEcommerceTemplate().replace(/{{PRODUCT_NAME}}/g, 'File Manager')
      .replace(/{{PRODUCT_DESCRIPTION}}/g, 'Organize and manage your files securely')
      .replace(/{{FEATURES_HTML}}/g, `
        <div class="feature-card">
            <div class="feature-icon">📁</div>
            <h3>File Management</h3>
            <p>Organize and categorize files</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Storage</h3>
            <p>Secure cloud storage solution</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🔗</div>
            <h3>Sharing</h3>
            <p>Share files with team members</p>
        </div>
      `);
  }

  generateProductConfig(productId, theme, features, templateType) {
    const productName = this.getProductName(productId, templateType);
    const productClass = this.getProductClass(productId);
    
    return {
      id: productId,
      name: productName,
      theme: theme,
      features: features,
      templateType: templateType,
      className: productClass
    };
  }

  getProductName(productId, templateType) {
    const names = {
      ecommerce: 'E-Commerce Platform',
      crm: 'CRM System',
      project: 'Project Management',
      analytics: 'Analytics Platform',
      messaging: 'Messaging Platform',
      fileManager: 'File Manager'
    };
    return names[templateType] || `Business Solution ${productId.split('-')[1]}`;
  }

  getProductClass(productId) {
    const num = productId.split('-')[1];
    return `Product${num}App`;
  }

  async generateApp(productConfig) {
    const appDir = path.join(this.appsDir, productConfig.id, 'dist');
    const template = this.templates[productConfig.templateType] || this.templates.ecommerce;
    
    // Create directory
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }

    // Generate HTML content
    let htmlContent = template
      .replace(/{{PRODUCT_ID}}/g, productConfig.id)
      .replace(/{{PRODUCT_NAME}}/g, productConfig.name)
      .replace(/{{PRODUCT_CLASS}}/g, productConfig.className)
      .replace(/{{THEME}}/g, productConfig.theme);

    // Write the file
    const indexPath = path.join(appDir, 'index.html');
    fs.writeFileSync(indexPath, htmlContent);

    console.log(`✅ Generated ${productConfig.id}: ${productConfig.name}`);
  }

  async generateAllApps() {
    console.log('🚀 Generating 1000 frontend applications...\n');

    const themes = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink', 'indigo'];
    const templateTypes = ['ecommerce', 'crm', 'project', 'analytics', 'messaging', 'fileManager'];
    const featureSets = [
      ['analytics', 'dashboard', 'reports'],
      ['messaging', 'notifications', 'chat'],
      ['file-management', 'storage', 'sharing'],
      ['user-management', 'roles', 'permissions'],
      ['billing', 'subscriptions', 'payments'],
      ['workflow', 'automation', 'integrations']
    ];

    // Generate first 10 apps with specific templates
    for (let i = 1; i <= 10; i++) {
      const productId = `product-${i}`;
      const theme = themes[i % themes.length];
      const templateType = templateTypes[i % templateTypes.length];
      const features = featureSets[i % featureSets.length];

      const config = this.generateProductConfig(productId, theme, features, templateType);
      await this.generateApp(config);
    }

    // Generate remaining 990 apps with random configurations
    for (let i = 11; i <= 1000; i++) {
      const productId = `product-${i}`;
      const theme = themes[i % themes.length];
      const templateType = templateTypes[i % templateTypes.length];
      const features = featureSets[i % featureSets.length];

      const config = this.generateProductConfig(productId, theme, features, templateType);
      await this.generateApp(config);
    }

    console.log('\n🎉 Successfully generated 1000 frontend applications!');
    console.log('📁 Apps directory: apps/');
    console.log('🔗 Access them at: http://localhost:3000/product-1 through product-1000');
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new AppGenerator();
  generator.generateAllApps()
    .then(() => {
      console.log('\n✨ Generation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    });
}

module.exports = AppGenerator; 
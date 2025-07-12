// Shared JavaScript Utilities for Multi-Tenant Frontend System

class MultiTenantUtils {
  constructor() {
    this.baseUrl = window.location.origin;
    this.currentProduct = this.getProductFromUrl();
    this.token = localStorage.getItem('auth_token');
  }

  // Get product ID from URL
  getProductFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/^\/(product-\d+)/);
    return match ? match[1] : null;
  }

  // API request helper
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/${this.currentProduct}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication helpers
  async login(username, password, productId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          productId
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }

  // Theme management
  applyTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('current_theme', theme);
  }

  getCurrentTheme() {
    return localStorage.getItem('current_theme') || 'blue';
  }

  // UI helpers
  showLoading(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.innerHTML = '<div class="loading"></div>';
    }
  }

  hideLoading(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.innerHTML = '';
    }
  }

  showAlert(message, type = 'info', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, duration);
  }

  // Form validation
  validateForm(formData) {
    const errors = {};
    
    for (const [key, value] of formData.entries()) {
      if (!value || value.trim() === '') {
        errors[key] = `${key} is required`;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Data formatting
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  // Local storage helpers
  setItem(key, value) {
    const productKey = `${this.currentProduct}_${key}`;
    localStorage.setItem(productKey, JSON.stringify(value));
  }

  getItem(key, defaultValue = null) {
    const productKey = `${this.currentProduct}_${key}`;
    const item = localStorage.getItem(productKey);
    return item ? JSON.parse(item) : defaultValue;
  }

  removeItem(key) {
    const productKey = `${this.currentProduct}_${key}`;
    localStorage.removeItem(productKey);
  }

  // Event handling
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // DOM helpers
  createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  }

  addEventListeners(selectors, event, handler) {
    const elements = document.querySelectorAll(selectors);
    elements.forEach(element => {
      element.addEventListener(event, handler);
    });
  }

  // Analytics tracking
  trackEvent(eventName, data = {}) {
    if (window.gtag) {
      window.gtag('event', eventName, {
        product_id: this.currentProduct,
        ...data
      });
    }
    
    // Also send to our API
    this.apiRequest('/action', {
      method: 'POST',
      body: JSON.stringify({
        action: eventName,
        data: data
      })
    }).catch(console.error);
  }

  // Error handling
  handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    this.showAlert(`An error occurred: ${error.message}`, 'error');
  }

  // Performance monitoring
  measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }

  async measureAsyncPerformance(name, fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
}

// Global instance
window.MultiTenantUtils = new MultiTenantUtils();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MultiTenantUtils;
} 
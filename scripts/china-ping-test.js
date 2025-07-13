#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ChinaPingTester {
  constructor() {
    this.domains = [
      'rent.mornscience.com',
      'job.mornscience.com',
      'social.mornscience.com',
      'deepfake-detector.mornscience.com',
      'accelerator.mornscience.com'
    ];
    
    this.chinaCities = [
      { name: '北京', code: 'beijing' },
      { name: '上海', code: 'shanghai' },
      { name: '广州', code: 'guangzhou' },
      { name: '深圳', code: 'shenzhen' },
      { name: '杭州', code: 'hangzhou' },
      { name: '成都', code: 'chengdu' },
      { name: '武汉', code: 'wuhan' },
      { name: '西安', code: 'xian' },
      { name: '重庆', code: 'chongqing' },
      { name: '南京', code: 'nanjing' }
    ];
  }

  async testWithExternalService(domain) {
    console.log(`\n🌐 测试域名: ${domain}`);
    console.log('='.repeat(50));
    
    // Test with multiple external services
    const results = {
      domain,
      timestamp: new Date().toISOString(),
      services: {}
    };
    
    // 1. Test with ipapi.co (free geolocation API)
    try {
      console.log('📍 使用 ipapi.co 测试地理位置...');
      const ipResponse = await axios.get(`http://ip-api.com/json/${domain}`, {
        timeout: 10000
      });
      
      results.services.ipapi = {
        success: true,
        country: ipResponse.data.country,
        region: ipResponse.data.regionName,
        city: ipResponse.data.city,
        isp: ipResponse.data.isp,
        latency: 'N/A (geolocation only)'
      };
      
      console.log(`  ✅ 服务器位置: ${ipResponse.data.city}, ${ipResponse.data.country}`);
      console.log(`  📡 ISP: ${ipResponse.data.isp}`);
      
    } catch (error) {
      console.log(`  ❌ ipapi.co 测试失败: ${error.message}`);
      results.services.ipapi = { success: false, error: error.message };
    }
    
    // 2. Test with httpbin.org (for basic connectivity)
    try {
      console.log('🌐 使用 httpbin.org 测试连接性...');
      const startTime = Date.now();
      const httpbinResponse = await axios.get('https://httpbin.org/delay/1', {
        timeout: 15000
      });
      const latency = Date.now() - startTime;
      
      results.services.httpbin = {
        success: true,
        latency: `${latency}ms`,
        status: httpbinResponse.status
      };
      
      console.log(`  ✅ 基础连接测试: ${latency}ms`);
      
    } catch (error) {
      console.log(`  ❌ httpbin.org 测试失败: ${error.message}`);
      results.services.httpbin = { success: false, error: error.message };
    }
    
    // 3. Test with your actual domain
    try {
      console.log('🎯 测试实际域名连接性...');
      const startTime = Date.now();
      const domainResponse = await axios.get(`https://${domain}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'ChinaPingTest/1.0'
        }
      });
      const latency = Date.now() - startTime;
      
      results.services.domain = {
        success: true,
        latency: `${latency}ms`,
        status: domainResponse.status,
        contentLength: domainResponse.data.length
      };
      
      console.log(`  ✅ 域名访问测试: ${latency}ms (状态: ${domainResponse.status})`);
      
    } catch (error) {
      console.log(`  ❌ 域名访问失败: ${error.message}`);
      results.services.domain = { success: false, error: error.message };
    }
    
    return results;
  }

  generateChinaTestGuide() {
    const guide = {
      title: '🇨🇳 中国地区Ping测试指南',
      timestamp: new Date().toISOString(),
      manualTests: [
        {
          service: '17CE (17ce.com)',
          description: '免费的中国速度测试服务',
          steps: [
            '访问 https://17ce.com',
            '输入你的域名',
            '选择测试城市 (北京、上海、广州等)',
            '查看ping延迟和丢包率'
          ],
          features: ['多城市测试', '免费使用', '详细报告']
        },
        {
          service: 'Ping.cn',
          description: '专业的中国ping测试工具',
          steps: [
            '访问 https://ping.cn',
            '输入域名',
            '选择测试节点',
            '查看实时ping结果'
          ],
          features: ['实时测试', '多节点', '历史记录']
        },
        {
          service: 'IPIP.net',
          description: '网络分析工具',
          steps: [
            '访问 https://tools.ipip.net',
            '使用ping工具',
            '选择中国节点',
            '分析网络路径'
          ],
          features: ['专业工具', '路径分析', '详细报告']
        }
      ],
      automatedTests: [
        {
          name: '阿里云CDN测试',
          url: 'https://cdn.aliyun.com',
          description: '测试阿里云CDN节点延迟'
        },
        {
          name: '腾讯云CDN测试',
          url: 'https://cdn.cloud.tencent.com',
          description: '测试腾讯云CDN节点延迟'
        },
        {
          name: '百度云CDN测试',
          url: 'https://bce.bdstatic.com',
          description: '测试百度云CDN节点延迟'
        }
      ],
      recommendations: [
        {
          type: 'CDN',
          title: '部署中国CDN',
          description: '建议使用阿里云或腾讯云CDN',
          benefits: ['降低延迟', '提高稳定性', '减少丢包']
        },
        {
          type: 'DNS',
          title: '优化DNS解析',
          description: '使用中国本地DNS服务',
          benefits: ['快速解析', '就近访问', '减少延迟']
        },
        {
          type: 'Server',
          title: '选择中国服务器',
          description: '考虑使用中国境内的服务器',
          benefits: ['最低延迟', '最佳稳定性', '合规性']
        }
      ]
    };
    
    return guide;
  }

  printChinaTestGuide(guide) {
    console.log('\n' + '='.repeat(80));
    console.log('🇨🇳 中国地区Ping测试指南');
    console.log('='.repeat(80));
    
    console.log(`\n📅 生成时间: ${new Date(guide.timestamp).toLocaleString('zh-CN')}`);
    
    // Manual Tests
    console.log('\n🔧 手动测试工具:');
    guide.manualTests.forEach((test, index) => {
      console.log(`\n  ${index + 1}. ${test.service}`);
      console.log(`     描述: ${test.description}`);
      console.log(`     步骤:`);
      test.steps.forEach((step, stepIndex) => {
        console.log(`       ${stepIndex + 1}. ${step}`);
      });
      console.log(`     特点: ${test.features.join(', ')}`);
    });
    
    // Automated Tests
    console.log('\n🤖 自动化测试建议:');
    guide.automatedTests.forEach((test, index) => {
      console.log(`\n  ${index + 1}. ${test.name}`);
      console.log(`     URL: ${test.url}`);
      console.log(`     描述: ${test.description}`);
    });
    
    // Recommendations
    console.log('\n💡 优化建议:');
    guide.recommendations.forEach((rec, index) => {
      console.log(`\n  ${index + 1}. ${rec.title}`);
      console.log(`     描述: ${rec.description}`);
      console.log(`     好处: ${rec.benefits.join(', ')}`);
    });
    
    console.log('\n' + '='.repeat(80));
  }

  async runTests() {
    console.log('🇨🇳 开始中国地区Ping测试...');
    console.log('='.repeat(60));
    
    const results = [];
    
    for (const domain of this.domains) {
      const result = await this.testWithExternalService(domain);
      results.push(result);
    }
    
    // Generate China test guide
    const guide = this.generateChinaTestGuide();
    this.printChinaTestGuide(guide);
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `china-ping-test-${timestamp}.json`;
    const filepath = path.join(__dirname, '..', 'logs', filename);
    
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const report = {
      guide,
      results,
      summary: {
        totalTests: results.length,
        successfulTests: results.filter(r => r.services.domain?.success).length,
        failedTests: results.filter(r => !r.services.domain?.success).length
      }
    };
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n📊 中国Ping测试报告已保存: ${filepath}`);
    
    return report;
  }
}

// Main execution
async function main() {
  const tester = new ChinaPingTester();
  await tester.runTests();
}

// Export for use in other modules
module.exports = { ChinaPingTester };

// Run if called directly
if (require.main === module) {
  main();
} 
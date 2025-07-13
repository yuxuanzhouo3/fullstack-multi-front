#!/usr/bin/env node

const { exec } = require('child_process');
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
  }

  async pingDomain(domain) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32' 
        ? `ping -n 4 ${domain}`
        : `ping -c 4 ${domain}`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({
            domain,
            success: false,
            error: error.message
          });
          return;
        }
        
        // Parse ping output
        const lines = stdout.split('\n');
        const pings = [];
        
        for (const line of lines) {
          const match = line.match(/time[=:]\s*(\d+(?:\.\d+)?)\s*ms/i);
          if (match) {
            pings.push(parseFloat(match[1]));
          }
        }
        
        const avgLatency = pings.length > 0 
          ? pings.reduce((sum, ping) => sum + ping, 0) / pings.length 
          : 0;
        
        resolve({
          domain,
          success: pings.length > 0,
          avgLatency,
          pings,
          packetLoss: pings.length > 0 ? ((4 - pings.length) / 4) * 100 : 100
        });
      });
    });
  }

  async runLocalTests() {
    console.log('🌐 本地Ping测试 (当前网络环境)');
    console.log('='.repeat(50));
    
    const results = [];
    
    for (const domain of this.domains) {
      console.log(`\n🔗 测试 ${domain}...`);
      const result = await this.pingDomain(domain);
      results.push(result);
      
      if (result.success) {
        console.log(`  ✅ 平均延迟: ${result.avgLatency.toFixed(2)}ms`);
        console.log(`  📊 丢包率: ${result.packetLoss.toFixed(1)}%`);
      } else {
        console.log(`  ❌ 连接失败: ${result.error}`);
      }
    }
    
    return results;
  }

  printChinaTestGuide() {
    console.log('\n' + '='.repeat(80));
    console.log('🇨🇳 中国地区Ping测试指南');
    console.log('='.repeat(80));
    
    console.log('\n📋 由于网络限制，无法直接从国外测试中国网络。');
    console.log('请使用以下方法进行真实的中国网络测试：');
    
    console.log('\n🔧 手动测试工具:');
    
    console.log('\n  1. 17CE (17ce.com)');
    console.log('     描述: 免费的中国速度测试服务');
    console.log('     步骤:');
    console.log('       1. 访问 https://17ce.com');
    console.log('       2. 输入你的域名');
    console.log('       3. 选择测试城市 (北京、上海、广州等)');
    console.log('       4. 查看ping延迟和丢包率');
    console.log('     特点: 多城市测试、免费使用、详细报告');
    
    console.log('\n  2. Ping.cn');
    console.log('     描述: 专业的中国ping测试工具');
    console.log('     步骤:');
    console.log('       1. 访问 https://ping.cn');
    console.log('       2. 输入域名');
    console.log('       3. 选择测试节点');
    console.log('       4. 查看实时ping结果');
    console.log('     特点: 实时测试、多节点、历史记录');
    
    console.log('\n  3. IPIP.net');
    console.log('     描述: 网络分析工具');
    console.log('     步骤:');
    console.log('       1. 访问 https://tools.ipip.net');
    console.log('       2. 使用ping工具');
    console.log('       3. 选择中国节点');
    console.log('       4. 分析网络路径');
    console.log('     特点: 专业工具、路径分析、详细报告');
    
    console.log('\n💡 优化建议:');
    
    console.log('\n  1. 部署中国CDN');
    console.log('     描述: 建议使用阿里云或腾讯云CDN');
    console.log('     好处: 降低延迟、提高稳定性、减少丢包');
    
    console.log('\n  2. 优化DNS解析');
    console.log('     描述: 使用中国本地DNS服务');
    console.log('     好处: 快速解析、就近访问、减少延迟');
    
    console.log('\n  3. 选择中国服务器');
    console.log('     描述: 考虑使用中国境内的服务器');
    console.log('     好处: 最低延迟、最佳稳定性、合规性');
    
    console.log('\n🎯 推荐测试流程:');
    console.log('  1. 使用17CE测试基础性能');
    console.log('  2. 使用Ping.cn进行详细分析');
    console.log('  3. 使用IPIP.net进行专业诊断');
    console.log('  4. 根据结果部署CDN优化');
    
    console.log('\n' + '='.repeat(80));
  }

  async run() {
    try {
      // Run local tests first
      const localResults = await this.runLocalTests();
      
      // Print China test guide
      this.printChinaTestGuide();
      
      // Save results
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `china-ping-test-${timestamp}.json`;
      const filepath = path.join(__dirname, 'logs', filename);
      
      // Ensure logs directory exists
      const logsDir = path.join(__dirname, 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const report = {
        timestamp: new Date().toISOString(),
        localResults,
        summary: {
          totalTests: localResults.length,
          successfulTests: localResults.filter(r => r.success).length,
          failedTests: localResults.filter(r => !r.success).length,
          avgLatency: localResults.filter(r => r.success)
            .reduce((sum, r) => sum + r.avgLatency, 0) / localResults.filter(r => r.success).length || 0
        }
      };
      
      fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
      console.log(`\n📊 测试报告已保存: ${filepath}`);
      
      console.log('\n✅ 测试完成!');
      console.log('请使用上述工具进行真实的中国网络测试。');
      
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
    }
  }
}

// Run the test
const tester = new ChinaPingTester();
tester.run(); 
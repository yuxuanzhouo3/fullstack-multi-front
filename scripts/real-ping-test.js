#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class RealPingTester {
  constructor() {
    this.domains = [
      'rent.mornscience.com',
      'job.mornscience.com',
      'social.mornscience.com',
      'deepfake-detector.mornscience.com',
      'accelerator.mornscience.com'
    ];
    
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      detailed: {}
    };
  }

  async pingDomain(domain, count = 4) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32' 
        ? `ping -n ${count} ${domain}`
        : `ping -c ${count} ${domain}`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({
            domain,
            success: false,
            error: error.message,
            pings: []
          });
          return;
        }
        
        const pings = this.parsePingOutput(stdout, domain);
        const avgLatency = pings.length > 0 
          ? pings.reduce((sum, ping) => sum + ping.latency, 0) / pings.length 
          : 0;
        
        resolve({
          domain,
          success: pings.length > 0,
          avgLatency,
          pings,
          packetLoss: pings.length > 0 ? ((count - pings.length) / count) * 100 : 100
        });
      });
    });
  }

  parsePingOutput(output, domain) {
    const pings = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Parse ping response time
      const match = line.match(/time[=:]\s*(\d+(?:\.\d+)?)\s*ms/i);
      if (match) {
        pings.push({
          latency: parseFloat(match[1]),
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return pings;
  }

  async testAllDomains() {
    console.log('🌐 开始真实Ping测试...');
    console.log(`测试域名: ${this.domains.join(', ')}`);
    
    const results = [];
    
    for (const domain of this.domains) {
      console.log(`\n🔗 测试 ${domain}...`);
      const result = await this.pingDomain(domain, 4);
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

  generateReport(results) {
    const successfulTests = results.filter(r => r.success);
    const failedTests = results.filter(r => !r.success);
    
    const avgLatency = successfulTests.length > 0 
      ? successfulTests.reduce((sum, r) => sum + r.avgLatency, 0) / successfulTests.length 
      : 0;
    
    const avgPacketLoss = results.length > 0 
      ? results.reduce((sum, r) => sum + r.packetLoss, 0) / results.length 
      : 100;
    
    const report = {
      title: '🌐 真实Ping测试报告',
      timestamp: this.results.timestamp,
      summary: {
        totalTests: results.length,
        successfulTests: successfulTests.length,
        failedTests: failedTests.length,
        averageLatency: avgLatency,
        averagePacketLoss: avgPacketLoss,
        successRate: (successfulTests.length / results.length) * 100
      },
      detailed: results,
      recommendations: this.generateRecommendations(results)
    };
    
    return report;
  }

  generateRecommendations(results) {
    const recommendations = [];
    
    const avgLatency = results.filter(r => r.success)
      .reduce((sum, r) => sum + r.avgLatency, 0) / results.filter(r => r.success).length;
    
    const avgPacketLoss = results.reduce((sum, r) => sum + r.packetLoss, 0) / results.length;
    
    if (avgLatency > 200) {
      recommendations.push({
        type: 'Performance',
        priority: 'high',
        title: '延迟过高',
        description: `平均延迟 ${avgLatency.toFixed(2)}ms 过高`,
        action: '考虑部署CDN或更换服务器位置'
      });
    }
    
    if (avgPacketLoss > 10) {
      recommendations.push({
        type: 'Network',
        priority: 'high',
        title: '丢包严重',
        description: `平均丢包率 ${avgPacketLoss.toFixed(2)}% 过高`,
        action: '检查网络质量和ISP线路'
      });
    }
    
    const failedDomains = results.filter(r => !r.success);
    if (failedDomains.length > 0) {
      recommendations.push({
        type: 'Connectivity',
        priority: 'critical',
        title: '域名解析失败',
        description: `${failedDomains.length} 个域名无法访问`,
        action: '检查DNS配置和域名解析'
      });
    }
    
    return recommendations;
  }

  printReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🌐 真实Ping测试报告');
    console.log('='.repeat(60));
    
    console.log(`\n📅 测试时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    
    // Summary
    console.log('\n📊 测试总结:');
    console.log(`  总测试数: ${report.summary.totalTests}`);
    console.log(`  成功: ${report.summary.successfulTests}`);
    console.log(`  失败: ${report.summary.failedTests}`);
    console.log(`  成功率: ${report.summary.successRate.toFixed(2)}%`);
    console.log(`  平均延迟: ${report.summary.averageLatency.toFixed(2)}ms`);
    console.log(`  平均丢包率: ${report.summary.averagePacketLoss.toFixed(2)}%`);
    
    // Detailed results
    console.log('\n🔍 详细结果:');
    report.detailed.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`\n  ${status} ${result.domain}:`);
      
      if (result.success) {
        console.log(`    平均延迟: ${result.avgLatency.toFixed(2)}ms`);
        console.log(`    丢包率: ${result.packetLoss.toFixed(1)}%`);
        console.log(`    成功Ping: ${result.pings.length} 次`);
      } else {
        console.log(`    错误: ${result.error}`);
      }
    });
    
    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 优化建议:');
      report.recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟡' : '🟢';
        console.log(`  ${priorityEmoji} ${rec.title}`);
        console.log(`     ${rec.description}`);
        console.log(`     建议: ${rec.action}`);
        console.log('');
      });
    } else {
      console.log('\n✅ 所有域名表现良好!');
    }
    
    console.log('\n' + '='.repeat(60));
  }

  saveReport(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `real-ping-test-${timestamp}.json`;
    const filepath = path.join(__dirname, '..', 'logs', filename);
    
    // Ensure logs directory exists
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 真实Ping测试报告已保存: ${filepath}`);
    
    return filepath;
  }

  async run() {
    try {
      const results = await this.testAllDomains();
      const report = this.generateReport(results);
      
      this.printReport(report);
      const filepath = this.saveReport(report);
      
      console.log(`\n✅ 真实Ping测试完成! 报告已保存到: ${filepath}`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Ping测试失败:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const tester = new RealPingTester();
  await tester.run();
}

// Export for use in other modules
module.exports = { RealPingTester };

// Run if called directly
if (require.main === module) {
  main();
} 
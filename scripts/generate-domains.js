#!/usr/bin/env node

const fs = require('fs');

// Generate random 3-digit number
function generateRandomNumber() {
  return Math.floor(Math.random() * 900) + 100; // 100-999
}

// Read current tenants
const tenants = JSON.parse(fs.readFileSync('config/tenants.json', 'utf8'));

// Generate new domain mappings
const dnsConfig = {};

tenants.forEach(tenant => {
  // Generate 3 random domains for each product
  for (let i = 0; i < 3; i++) {
    const randomNum = generateRandomNumber();
    const domain = `morn${randomNum}.com`;
    dnsConfig[domain] = tenant.slug;
  }
});

// Write back to file
fs.writeFileSync('config/dns-config.json', JSON.stringify(dnsConfig, null, 2));

console.log('🎲 Generated random domains:');
Object.entries(dnsConfig).forEach(([domain, slug]) => {
  const tenant = tenants.find(t => t.slug === slug);
  console.log(`   • ${domain} -> ${tenant.displayName}`);
});

console.log('\n📝 Updated dns-config.json with new random domains'); 
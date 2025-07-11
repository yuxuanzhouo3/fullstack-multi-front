#!/usr/bin/env node

const fs = require('fs');

// Generate random 50-digit number
function generateRandomSlug() {
  // Generate 50 random digits
  let randomNum = '';
  for (let i = 0; i < 50; i++) {
    randomNum += Math.floor(Math.random() * 10);
  }
  return randomNum;
}

// Read current tenants
const tenants = JSON.parse(fs.readFileSync('config/tenants.json', 'utf8'));

// Generate new random slugs
tenants.forEach(tenant => {
  tenant.slug = generateRandomSlug();
});

// Write back to file
fs.writeFileSync('config/tenants.json', JSON.stringify(tenants, null, 2));

console.log('🎲 Generated random slugs:');
tenants.forEach(tenant => {
  console.log(`   • ${tenant.displayName}: ${tenant.slug}`);
});

console.log('\n📝 Updated tenants.json with new random slugs'); 
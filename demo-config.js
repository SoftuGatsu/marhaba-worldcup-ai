#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎭 Demo Mode Configuration Helper\n');

const envPath = path.join(__dirname, '.env');

// Read current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('No .env file found, creating new one...');
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'enable') {
  // Enable demo mode
  envContent = envContent.replace(/VITE_DEMO_MODE=.*/g, 'VITE_DEMO_MODE=true');
  if (!envContent.includes('VITE_DEMO_MODE=')) {
    envContent += '\nVITE_DEMO_MODE=true\n';
  }
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Demo mode ENABLED');
  console.log('📝 Fill out the travel form to see demo responses');
  console.log('📖 Check DEMO_MODE_GUIDE.md for form values to use');
  
} else if (command === 'disable') {
  // Disable demo mode
  envContent = envContent.replace(/VITE_DEMO_MODE=.*/g, 'VITE_DEMO_MODE=false');
  if (!envContent.includes('VITE_DEMO_MODE=')) {
    envContent += '\nVITE_DEMO_MODE=false\n';
  }
  fs.writeFileSync(envPath, envContent);
  console.log('❌ Demo mode DISABLED');
  console.log('🔄 Responses will now use real agents or backend API');
  
} else if (command === 'status') {
  // Check current status
  const isDemoMode = envContent.includes('VITE_DEMO_MODE=true');
  const isAgentMode = envContent.includes('VITE_AGENT_ONLY_MODE=true');
  
  console.log('Current Configuration:');
  console.log(`📺 Demo Mode: ${isDemoMode ? '✅ ENABLED' : '❌ DISABLED'}`);
  console.log(`🤖 Agent Only Mode: ${isAgentMode ? '✅ ENABLED' : '❌ DISABLED'}`);
  
  if (isDemoMode) {
    console.log('\n🎯 Demo Mode is active - responses will be hardcoded');
    console.log('📋 Use the form values from DEMO_MODE_GUIDE.md');
  } else if (isAgentMode) {
    console.log('\n🤖 Agent Mode is active - requires agent services on localhost:8080');
  } else {
    console.log('\n🌐 Backend Mode is active - requires backend API');
  }
  
} else if (command === 'scenarios') {
  // List available demo scenarios
  console.log('Available Demo Scenarios:\n');
  console.log('1. 🏰 Luxury Marrakech Experience');
  console.log('   - High-end family trip with cultural activities');
  console.log('   - Budget: $8000-12000, 4 passengers, luxury accommodations\n');
  
  console.log('2. 🎒 Budget Adventure Fez Trip');
  console.log('   - Solo backpacker cultural exploration');
  console.log('   - Budget: $1500-2000, 1 passenger, budget accommodations\n');
  
  console.log('3. 🏢 Coastal Casablanca Business Trip');
  console.log('   - Modern business-focused stay');
  console.log('   - Budget: $4000-6000, 2 passengers, modern hotel\n');
  
  console.log('📖 See DEMO_MODE_GUIDE.md for detailed form values');
  
} else {
  // Show help
  console.log('Usage: node demo-config.js <command>\n');
  console.log('Commands:');
  console.log('  enable     - Enable demo mode');
  console.log('  disable    - Disable demo mode');
  console.log('  status     - Show current configuration');
  console.log('  scenarios  - List available demo scenarios');
  console.log('\nExamples:');
  console.log('  node demo-config.js enable');
  console.log('  node demo-config.js status');
  console.log('  node demo-config.js scenarios');
}

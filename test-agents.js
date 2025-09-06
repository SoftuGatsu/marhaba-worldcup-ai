#!/usr/bin/env node

/**
 * Test script for agent connectivity and timeout handling
 * Usage: node test-agents.js
 */

const agents = [
  'food-recommender',
  'travel-booking',
  'flight-agent',
  'hotel-agent',
  'restaurant-agent',
  'activities-agent',
  'weather-agent',
  'research-agent'
];

async function testAgent(agentName) {
  const url = `http://localhost:8080/agent/${agentName}`;
  const payload = { input: 'test connection' };
  
  console.log(`Testing ${agentName}...`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60 seconds
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    if (!response.ok) {
      clearTimeout(timeoutId);
      console.log(`❌ ${agentName}: Error ${response.status} - ${response.statusText}`);
      return false;
    }
    
    // For streaming responses, we just need to verify we get a 200 and can read some data
    const reader = response.body?.getReader();
    if (!reader) {
      clearTimeout(timeoutId);
      console.log(`❌ ${agentName}: No response body`);
      return false;
    }
    
    try {
      // Read just the first chunk to verify the stream is working
      const { value } = await reader.read();
      
      if (value && value.length > 0) {
        clearTimeout(timeoutId);
        console.log(`✅ ${agentName}: Available (${response.status}) - Streaming response working`);
        return true;
      } else {
        clearTimeout(timeoutId);
        console.log(`❌ ${agentName}: Empty response stream`);
        return false;
      }
    } finally {
      reader.releaseLock();
    }
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log(`⏱️  ${agentName}: Timeout (>30s)`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`🚫 ${agentName}: Connection refused (service not running?)`);
    } else {
      console.log(`❌ ${agentName}: ${error.message}`);
    }
    return false;
  }
}

async function testAllAgents() {
  console.log('🧪 Testing agent connectivity...\n');
  
  const results = [];
  
  // Test agents sequentially instead of in parallel to avoid overwhelming the server
  for (const agent of agents) {
    const result = await testAgent(agent);
    results.push({ agent, available: result });
    
    // Wait a bit between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Summary:');
  const available = results.filter(r => r.available);
  const unavailable = results.filter(r => !r.available);
  
  console.log(`✅ Available: ${available.length}/${results.length}`);
  if (available.length > 0) {
    available.forEach(r => console.log(`   - ${r.agent}`));
  }
  
  if (unavailable.length > 0) {
    console.log(`❌ Unavailable: ${unavailable.length}/${results.length}`);
    unavailable.forEach(r => console.log(`   - ${r.agent}`));
  }
  
  if (available.length === 0) {
    console.log('\n💡 To start agent services, ensure they are running on localhost:8080');
    console.log('   You can test manually with:');
    console.log('   curl -X POST "http://localhost:8080/agent/food-recommender" -H "Content-Type: application/json" -d \'{"input": "hello"}\'');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.log('   Run: npm install node-fetch');
  process.exit(1);
}

testAllAgents().catch(console.error);

#!/usr/bin/env node

async function testSingleAgent(agentName) {
  const url = `http://localhost:8080/agent/${agentName}`;
  const payload = { input: 'hello' };
  
  console.log(`\n=== Testing ${agentName} ===`);
  
  try {
    console.log('Making request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Error response body: ${errorText}`);
      return false;
    }
    
    // Try to read the stream
    const reader = response.body?.getReader();
    if (!reader) {
      console.log('No response body reader available');
      return false;
    }
    
    const decoder = new TextDecoder();
    let chunkCount = 0;
    let totalData = '';
    
    console.log('Reading stream...');
    
    try {
      while (chunkCount < 5) { // Only read first 5 chunks for debugging
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream ended');
          break;
        }
        
        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        totalData += chunk;
        console.log(`Chunk ${chunkCount}: ${chunk.slice(0, 100)}...`);
        
        if (chunk.includes('"phase":"done"')) {
          console.log('Found completion marker');
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    console.log(`Total chunks read: ${chunkCount}`);
    console.log(`Total data length: ${totalData.length}`);
    
    return true;
    
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(`Error name: ${error.name}`);
    console.log(`Error stack: ${error.stack}`);
    return false;
  }
}

// Test a few agents
const agents = ['research-agent', 'food-recommender', 'flight-agent'];

async function runTests() {
  for (const agent of agents) {
    await testSingleAgent(agent);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
}

runTests().catch(console.error);

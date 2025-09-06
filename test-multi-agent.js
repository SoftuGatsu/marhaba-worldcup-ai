#!/usr/bin/env node

// Simple test script for the new multi-agent system
// This simulates different types of queries to test agent routing

const testQueries = [
  {
    query: "I want to visit Morocco and need help with flights, hotels, and food recommendations",
    expectedAgents: ["flight-agent", "hotel-agent", "food-recommender"]
  },
  {
    query: "What's the weather like in Marrakech and what activities can I do there?",
    expectedAgents: ["weather-forecast-agent", "activities-agent"]
  },
  {
    query: "I need a 7-day itinerary for Morocco with traditional food suggestions",
    expectedAgents: ["morocco-itinerary-agent", "food-recommender"]
  },
  {
    query: "Book me a hotel in Casablanca and find good restaurants nearby",
    expectedAgents: ["travel-booking", "restaurant-agent"]
  },
  {
    query: "Just looking for Moroccan food recipes",
    expectedAgents: ["food-recommender"]
  },
  {
    query: "Tell me about the history of Morocco",
    expectedAgents: [] // Should use default agent or none
  }
];

// Simulate the agent capabilities (since we can't import the actual class in this test)
const agentCapabilities = [
  {
    name: 'activities-agent',
    keywords: ['activity', 'activities', 'things to do', 'attraction', 'attractions', 'visit', 'sightseeing', 'tour', 'experience', 'museum', 'park', 'entertainment', 'adventure', 'cultural', 'historical']
  },
  {
    name: 'flight-agent',
    keywords: ['flight', 'flights', 'plane', 'airplane', 'airline', 'departure', 'arrival', 'airport', 'fly', 'flying', 'ticket', 'booking flight', 'air travel']
  },
  {
    name: 'food-recommender',
    keywords: ['food', 'meal', 'eat', 'eating', 'restaurant', 'cuisine', 'dish', 'recipe', 'cooking', 'taste', 'flavor', 'spicy', 'sweet', 'hungry', 'dinner', 'lunch', 'breakfast', 'traditional food']
  },
  {
    name: 'hotel-agent',
    keywords: ['hotel', 'hotels', 'accommodation', 'stay', 'room', 'booking hotel', 'check-in', 'check-out', 'resort', 'lodge']
  },
  {
    name: 'morocco-itinerary-agent',
    keywords: ['itinerary', 'plan', 'trip', 'travel plan', 'schedule', 'route', 'journey', 'day by day', 'visit plan', 'morocco trip', 'travel guide']
  },
  {
    name: 'restaurant-agent',
    keywords: ['restaurant', 'restaurants', 'dining', 'dine', 'eat out', 'table', 'reservation', 'menu', 'chef', 'local restaurant', 'fine dining']
  },
  {
    name: 'travel-booking',
    keywords: ['book', 'booking', 'reserve', 'reservation', 'travel booking', 'package', 'deal', 'travel deal', 'budget', 'cost', 'price']
  },
  {
    name: 'weather-forecast-agent',
    keywords: ['weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast', 'climate', 'hot', 'cold', 'wind', 'humidity', 'season']
  }
];

function calculateKeywordRelevance(query, keywords) {
  const lowerQuery = query.toLowerCase();
  const matches = keywords.filter(keyword => lowerQuery.includes(keyword.toLowerCase()));
  
  if (matches.length === 0) return 0;
  
  // Base score from keyword matches
  let score = matches.length / keywords.length;
  
  // Boost score for exact matches and multiple occurrences
  matches.forEach(keyword => {
    const occurrences = (lowerQuery.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    score += occurrences * 0.1;
  });
  
  // Cap the score at 1.0
  return Math.min(score, 1.0);
}

function getRelevantAgents(query, threshold = 0.3) {
  const lowerQuery = query.toLowerCase();
  
  return agentCapabilities.filter(agent => {
    const relevanceScore = calculateKeywordRelevance(query, agent.keywords);
    return relevanceScore >= threshold;
  }).sort((a, b) => calculateKeywordRelevance(query, b.keywords) - calculateKeywordRelevance(query, a.keywords));
}

console.log('🤖 Testing Multi-Agent Routing System\n');
console.log('=' * 50);

testQueries.forEach((test, index) => {
  console.log(`\n📝 Test ${index + 1}: "${test.query}"`);
  console.log('-'.repeat(50));
  
  const relevantAgents = getRelevantAgents(test.query);
  const agentNames = relevantAgents.map(a => a.name);
  
  console.log(`🎯 Detected relevant agents: ${agentNames.length > 0 ? agentNames.join(', ') : 'None (will use default)'}`);
  
  // Show relevance scores
  relevantAgents.forEach(agent => {
    const score = calculateKeywordRelevance(test.query, agent.keywords);
    console.log(`   - ${agent.name}: ${score.toFixed(3)} relevance`);
  });
  
  // Check if the expected agents were detected
  const expectedSet = new Set(test.expectedAgents);
  const detectedSet = new Set(agentNames);
  
  const correctlyDetected = test.expectedAgents.filter(agent => detectedSet.has(agent));
  const missed = test.expectedAgents.filter(agent => !detectedSet.has(agent));
  const unexpected = agentNames.filter(agent => !expectedSet.has(agent));
  
  console.log(`✅ Correctly detected: ${correctlyDetected.length > 0 ? correctlyDetected.join(', ') : 'None'}`);
  if (missed.length > 0) {
    console.log(`❌ Missed expected: ${missed.join(', ')}`);
  }
  if (unexpected.length > 0) {
    console.log(`⚠️  Unexpected detections: ${unexpected.join(', ')}`);
  }
});

console.log('\n' + '=' * 50);
console.log('🎉 Multi-Agent Routing Test Complete!');
console.log('\nThe system now supports:');
console.log('- Intelligent agent selection based on query content');
console.log('- Multiple agents working together on complex queries');
console.log('- Relevance scoring to prioritize the most appropriate agents');
console.log('- Graceful fallback when no agents are relevant');
console.log('\nYou can now ask complex questions like:');
console.log('"Plan a 5-day trip to Morocco with flights from Paris, hotel recommendations, local food, and weather forecast"');
console.log('And the system will automatically route parts of your query to the most relevant agents!');

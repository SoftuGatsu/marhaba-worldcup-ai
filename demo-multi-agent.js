#!/usr/bin/env node

/**
 * Demonstration of the Multi-Agent Orchestration System
 * This script shows how different types of queries are handled by multiple agents
 */

console.log('🤖 Multi-Agent Orchestration System Demo\n');
console.log('========================================\n');

console.log('Your travel AI assistant now uses multiple specialized agents working together!\n');

const examples = [
  {
    title: "🌟 Complex Travel Planning",
    query: "Plan a 5-day trip to Morocco from London with flights, hotels in Marrakech, traditional food recommendations, and weather forecast",
    expectedAgents: ["flight-agent", "morocco-itinerary-agent", "hotel-agent", "food-recommender", "weather-forecast-agent"],
    description: "This complex query will trigger multiple agents to provide comprehensive travel planning."
  },
  {
    title: "🍽️ Food Focus",
    query: "I want to try authentic Moroccan cuisine and find the best restaurants in Casablanca",
    expectedAgents: ["food-recommender", "restaurant-agent"],
    description: "Food-related queries activate both food and restaurant agents for complete dining guidance."
  },
  {
    title: "🏨 Accommodation & Booking",
    query: "Book me a luxury hotel in Fes with a good budget and find activities nearby",
    expectedAgents: ["travel-booking", "hotel-agent", "activities-agent"],
    description: "Booking queries intelligently route to booking, accommodation, and activity agents."
  },
  {
    title: "🌤️ Weather & Activities",
    query: "What's the weather like in Marrakech and what can I do if it rains?",
    expectedAgents: ["weather-forecast-agent", "activities-agent"],
    description: "Weather queries can trigger activity recommendations for weather-dependent planning."
  },
  {
    title: "✈️ Flight Specific",
    query: "Find me flights from Paris to Casablanca for next month",
    expectedAgents: ["flight-agent"],
    description: "Simple flight queries focus on just the flight agent for targeted results."
  }
];

examples.forEach((example, index) => {
  console.log(`${example.title}`);
  console.log('-'.repeat(60));
  console.log(`📝 Query: "${example.query}"`);
  console.log(`🎯 Expected Agents: ${example.expectedAgents.join(', ')}`);
  console.log(`💡 ${example.description}`);
  console.log();
});

console.log('🔧 How It Works:');
console.log('===============');
console.log('1. 📊 Query Analysis: The system analyzes your question for keywords');
console.log('2. 🤖 Agent Selection: Relevant agents are selected based on content');
console.log('3. 🔄 Parallel Processing: Multiple agents work simultaneously');
console.log('4. 🎯 Context Extraction: Each agent gets specialized context');
console.log('5. 📋 Response Combination: All responses are combined coherently');
console.log('6. ❌ Smart Filtering: Irrelevant agents are automatically discarded');

console.log('\n🎉 Benefits:');
console.log('============');
console.log('✅ More comprehensive responses');
console.log('✅ Faster processing through parallel execution');
console.log('✅ Specialized expertise for each domain');
console.log('✅ Intelligent filtering of irrelevant information');
console.log('✅ Scalable architecture for adding new agents');

console.log('\n🚀 Try asking complex questions like:');
console.log('=====================================');
console.log('"I need a complete Morocco travel package with flights from New York, 4-star hotels, local food tours, weather info, and a 10-day itinerary"');
console.log('\n💫 The system will automatically route your query to all relevant agents!');

# Agent Integration Guide

## Current Implementation

The current implementation uses simulated agent responses for demonstration purposes. The agents are designed to intelligently respond based on the user's query content.

## Real Agent Integration

To integrate with your actual `food-recommender` and `travel-booking` agents, you'll need to create a backend API that can call the agents. Here's how:

### Backend API Endpoint

Create an API endpoint that can execute the agent commands:

```typescript
// backend/api/agents/food-recommender.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function callFoodRecommenderAgent(prompt: string) {
  try {
    const command = `cd /home/zczak/agents-at-scale-ark/ && fark agent food-recommender "${prompt}"`;
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout;
  } catch (error) {
    console.error('Agent call failed:', error);
    throw error;
  }
}
```

### Frontend Integration

Then update the `agentService.ts` to call your backend:

```typescript
async getFoodRecommendations(prompt: string): Promise<FoodRecommendationsPayload | null> {
  try {
    const response = await fetch('/api/agents/food-recommender', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const agentOutput = await response.text();
    return this.parseFoodRecommendations(agentOutput, prompt);
  } catch (error) {
    console.error('Failed to call food-recommender agent:', error);
    return null;
  }
}
```

### Agent Output Parsing

The parsing logic in `agentService.ts` is designed to handle the structured output from your agents. You may need to adjust the parsing methods based on the exact format your agents return.

## Features

### Food Recommender Integration
- Detects food-related queries automatically
- Extracts taste preferences, cuisine type, and dietary restrictions
- Provides rich food recommendations with cultural context
- Includes recipe links and detailed descriptions

### Travel Booking Integration
- Detects accommodation-related queries automatically
- Extracts destination, budget, dates, and accommodation type
- Provides detailed accommodation options with pricing
- Includes booking links and special offers

### Smart Query Detection

The system automatically detects whether a user is asking for:
- Food recommendations (keywords: food, meal, eat, restaurant, cuisine, etc.)
- Accommodation recommendations (keywords: hotel, stay, accommodation, etc.)
- General travel information (falls back to existing itinerary system)

## Testing

You can test the agent integration with queries like:

**Food Recommendations:**
- "I want spicy Moroccan food for dinner"
- "Recommend vegetarian Italian dishes"
- "What are some sweet and savory Middle Eastern meals?"

**Accommodation Recommendations:**
- "Find me a hotel in Marrakech for €150 per night"
- "I need a traditional riad for 4 nights starting June 15th"
- "Show me budget hostels in Morocco for the World Cup"

The system will intelligently route these queries to the appropriate agent and display the results in beautifully formatted cards.

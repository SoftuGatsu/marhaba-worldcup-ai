# Multi-Agent Orchestration System

## Overview

The system has been upgraded to intelligently route user queries to multiple relevant agents simultaneously, rather than just selecting a single agent. This provides more comprehensive and accurate responses by leveraging the specialized capabilities of each agent.

## How It Works

### 1. Agent Capabilities
Each agent is configured with:
- **Keywords**: Terms that indicate relevance to the agent's domain
- **Context Extractor**: Function that extracts relevant information for the agent
- **Relevance Scorer**: Function that calculates how relevant a query is (0.0 to 1.0)
- **Response Type**: Whether the agent returns text or structured data

### 2. Available Agents
- **activities-agent**: Activities, attractions, things to do, sightseeing
- **flight-agent**: Flight bookings, air travel, airport information
- **food-recommender**: Food recommendations, recipes, cuisine types
- **hotel-agent**: Hotels, accommodation, lodging
- **morocco-itinerary-agent**: Travel itineraries, trip planning, schedules
- **restaurant-agent**: Restaurant recommendations, dining options
- **travel-booking**: Travel booking services, deals, packages
- **weather-forecast-agent**: Weather information, climate, forecasts

### 3. Query Processing Flow

1. **Query Analysis**: The system analyzes the incoming user query
2. **Relevance Scoring**: Each agent's relevance to the query is calculated based on keyword matches
3. **Agent Selection**: Agents with relevance scores above the threshold (0.2) are selected
4. **Context Extraction**: Relevant information is extracted and formatted for each selected agent
5. **Parallel Execution**: All selected agents are called simultaneously with their specific context
6. **Response Combination**: Agent responses are combined into a coherent, structured response

### 4. Example Scenarios

#### Complex Query
**Input**: "I want to visit Morocco and need help with flights, hotels, and food recommendations"

**Process**:
- `flight-agent` (relevance: 0.35) → Flight information
- `hotel-agent` (relevance: 0.40) → Hotel recommendations  
- `food-recommender` (relevance: 0.28) → Food suggestions

**Output**: Combined response with sections for flights, hotels, and food

#### Simple Query
**Input**: "What's the weather like in Marrakech?"

**Process**:
- `weather-forecast-agent` (relevance: 0.85) → Weather information

**Output**: Weather forecast for Marrakech

#### No Relevant Agents
**Input**: "Tell me about the history of Morocco"

**Process**:
- No agents meet relevance threshold
- Falls back to default agent (food-recommender)

**Output**: General response or graceful fallback

## Key Improvements

### 1. Intelligent Routing
- Automatically determines which agents are relevant
- Can invoke multiple agents for complex queries
- Discards irrelevant agents to avoid noise

### 2. Context-Aware Processing
- Extracts specific context for each agent type
- Provides relevant information like dates, locations, preferences
- Improves agent response quality

### 3. Scalable Architecture
- Easy to add new agents
- Simple configuration through keyword lists
- Modular design for maintainability

### 4. Fallback Handling
- Graceful degradation when agents fail
- Hardcoded responses as backup
- Error isolation per agent

## Configuration

### Adding New Agents
To add a new agent, add an entry to the `agentCapabilities` array:

```typescript
{
  name: 'new-agent-name',
  keywords: ['keyword1', 'keyword2', 'phrase with spaces'],
  contextExtractor: (query: string) => this.extractNewAgentContext(query),
  relevanceScorer: (query: string) => this.scoreNewAgentRelevance(query),
  responseType: 'text' | 'structured'
}
```

### Adjusting Relevance Threshold
Change the `relevanceThreshold` value to make the system more or less inclusive:
- Lower values (0.1): More agents activated, more comprehensive responses
- Higher values (0.5): Fewer agents activated, more focused responses

### Customizing Keywords
Add more specific keywords to improve agent detection:
- Use exact phrases users might type
- Include synonyms and variations
- Consider different languages if needed

## Performance Considerations

- Agents are called in parallel for faster response times
- Failed agents don't block other agents
- Response combination is optimized for readability
- Timeout handling prevents hanging requests

## Testing

Use the provided test script to verify agent routing:
```bash
node test-multi-agent.js
```

This will test various query types and show which agents are activated.

## Future Enhancements

1. **Machine Learning**: Use ML models for better relevance scoring
2. **User Preferences**: Learn from user interactions to improve routing
3. **Context Memory**: Remember previous conversations for better context
4. **Dynamic Thresholds**: Adjust thresholds based on query complexity
5. **Agent Priorities**: Weight certain agents higher for specific domains

import { FoodRecommendationsPayload, AccommodationRecommendationsPayload } from '@/types/api';

interface AgentResponse {
  phase: string;
  query: {
    kind: string;
    apiVersion: string;
    metadata: {
      name: string;
      namespace: string;
      uid: string;
      resourceVersion: string;
      generation: number;
      creationTimestamp: string;
      finalizers: string[];
    };
    spec: {
      input: string;
      targets: Array<{
        type: string;
        name: string;
      }>;
      ttl: string;
      timeout: string;
    };
    status: {
      phase: string;
      responses: Array<{
        target: {
          type: string;
          name: string;
        };
        content: string;
      }>;
      tokenUsage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    };
  };
  type: string;
}

interface AgentCapability {
  name: string;
  keywords: string[];
  contextExtractor: (query: string) => string;
  relevanceScorer: (query: string) => number;
  responseType: 'text' | 'structured';
}

interface MultiAgentResponse {
  responses: Array<{
    agent: string;
    content: string;
    relevanceScore: number;
  }>;
  combinedContent: string;
}

class AgentService {
  private agentBaseUrl = '/agent'; // Use the proxy path instead of direct localhost:8080
  
  // Define agent capabilities and their relevance criteria
  private agentCapabilities: AgentCapability[] = [
    {
      name: 'activities-agent',
      keywords: ['activity', 'activities', 'things to do', 'attraction', 'attractions', 'visit', 'sightseeing', 'tour', 'experience', 'museum', 'park', 'entertainment', 'adventure', 'cultural', 'historical', 'what can i do', 'places to see'],
      contextExtractor: (query: string) => this.extractActivitiesContext(query),
      relevanceScorer: (query: string) => this.scoreActivityRelevance(query),
      responseType: 'text'
    },
    {
      name: 'flight-agent',
      keywords: ['flight', 'flights', 'plane', 'airplane', 'airline', 'departure', 'arrival', 'airport', 'fly', 'flying', 'ticket', 'booking flight', 'air travel', 'from', 'to'],
      contextExtractor: (query: string) => this.extractFlightContext(query),
      relevanceScorer: (query: string) => this.scoreFlightRelevance(query),
      responseType: 'structured'
    },
    {
      name: 'food-recommender',
      keywords: ['food', 'meal', 'eat', 'eating', 'cuisine', 'dish', 'recipe', 'cooking', 'taste', 'flavor', 'spicy', 'sweet', 'hungry', 'dinner', 'lunch', 'breakfast', 'traditional food', 'moroccan food', 'recommendations'],
      contextExtractor: (query: string) => this.extractFoodContext(query),
      relevanceScorer: (query: string) => this.scoreFoodRelevance(query),
      responseType: 'structured'
    },
    {
      name: 'hotel-agent',
      keywords: ['hotel', 'hotels', 'accommodation', 'stay', 'room', 'booking hotel', 'check-in', 'check-out', 'resort', 'lodge', 'where to stay'],
      contextExtractor: (query: string) => this.extractHotelContext(query),
      relevanceScorer: (query: string) => this.scoreHotelRelevance(query),
      responseType: 'structured'
    },
    {
      name: 'morocco-itinerary-agent',
      keywords: ['itinerary', 'plan', 'trip', 'travel plan', 'schedule', 'route', 'journey', 'day by day', 'visit plan', 'morocco trip', 'travel guide', 'days', 'day'],
      contextExtractor: (query: string) => this.extractItineraryContext(query),
      relevanceScorer: (query: string) => this.scoreItineraryRelevance(query),
      responseType: 'structured'
    },
    {
      name: 'restaurant-agent',
      keywords: ['restaurant', 'restaurants', 'dining', 'dine', 'eat out', 'table', 'reservation', 'menu', 'chef', 'local restaurant', 'fine dining', 'where to eat'],
      contextExtractor: (query: string) => this.extractRestaurantContext(query),
      relevanceScorer: (query: string) => this.scoreRestaurantRelevance(query),
      responseType: 'text'
    },
    {
      name: 'travel-booking',
      keywords: ['book', 'booking', 'reserve', 'reservation', 'travel booking', 'package', 'deal', 'travel deal', 'budget', 'cost', 'price', 'book me'],
      contextExtractor: (query: string) => this.extractBookingContext(query),
      relevanceScorer: (query: string) => this.scoreBookingRelevance(query),
      responseType: 'structured'
    },
    {
      name: 'weather-forecast-agent',
      keywords: ['weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast', 'climate', 'hot', 'cold', 'wind', 'humidity', 'season', 'weather like'],
      contextExtractor: (query: string) => this.extractWeatherContext(query),
      relevanceScorer: (query: string) => this.scoreWeatherRelevance(query),
      responseType: 'text'
    }
  ];

  private relevanceThreshold = 0.2; // Lower threshold to be more inclusive

  /**
   * Test the connection to the agent service
   */
  async testConnection(): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for connection test

    try {
      const response = await fetch(`${this.agentBaseUrl}/food-recommender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: 'test' }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Agent connection test failed:', error);
      return false;
    }
  }

  /**
   * Orchestrate multiple agents to handle a query
   */
  async orchestrateAgents(query: string): Promise<MultiAgentResponse> {
    console.log('Orchestrating agents for query:', query);
    
    // Determine relevant agents
    const relevantAgents = this.getRelevantAgents(query);
    console.log('Relevant agents:', relevantAgents.map(a => a.name));
    
    if (relevantAgents.length === 0) {
      // If no agents are relevant, use food-recommender as default
      const defaultAgent = this.agentCapabilities.find(a => a.name === 'food-recommender')!;
      relevantAgents.push(defaultAgent);
    }
    
    // Call agents in parallel with extracted context
    const agentPromises = relevantAgents.map(async (agent) => {
      try {
        const context = agent.contextExtractor(query);
        const response = await this.getGeneralResponse(context, agent.name);
        const relevanceScore = agent.relevanceScorer(query);
        
        return {
          agent: agent.name,
          content: response || 'No response from agent',
          relevanceScore
        };
      } catch (error) {
        console.error(`Failed to call ${agent.name}:`, error);
        return {
          agent: agent.name,
          content: `Error calling ${agent.name}`,
          relevanceScore: 0
        };
      }
    });
    
    const responses = await Promise.all(agentPromises);
    
    // Filter out failed responses and combine
    const validResponses = responses.filter(r => r.relevanceScore > 0);
    const combinedContent = this.combineAgentResponses(validResponses, query);
    
    return {
      responses: validResponses,
      combinedContent
    };
  }

  /**
   * Determine which agents are relevant for a given query
   */
  private getRelevantAgents(query: string): AgentCapability[] {
    const lowerQuery = query.toLowerCase();
    
    return this.agentCapabilities.filter(agent => {
      const relevanceScore = agent.relevanceScorer(query);
      return relevanceScore >= this.relevanceThreshold;
    }).sort((a, b) => b.relevanceScorer(query) - a.relevanceScorer(query));
  }

  /**
   * Combine responses from multiple agents into a coherent response
   */
  private combineAgentResponses(responses: Array<{agent: string, content: string, relevanceScore: number}>, originalQuery: string): string {
    if (responses.length === 0) {
      return "I'm sorry, I couldn't process your request at the moment.";
    }
    
    if (responses.length === 1) {
      return responses[0].content;
    }
    
    // Sort by relevance score
    responses.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    let combinedResponse = `Based on your request about "${originalQuery}", here's what I found:\n\n`;
    
    responses.forEach((response, index) => {
      const agentDisplayName = this.getAgentDisplayName(response.agent);
      combinedResponse += `## ${agentDisplayName}\n${response.content}\n\n`;
    });
    
    return combinedResponse.trim();
  }
  
  /**
   * Get display name for agent
   */
  private getAgentDisplayName(agentName: string): string {
    const displayNames: Record<string, string> = {
      'activities-agent': '🎯 Activities & Attractions',
      'flight-agent': '✈️ Flight Information',
      'food-recommender': '🍽️ Food Recommendations',
      'hotel-agent': '🏨 Accommodation',
      'morocco-itinerary-agent': '🗺️ Travel Itinerary',
      'restaurant-agent': '🍴 Restaurant Recommendations',
      'travel-booking': '💰 Travel Booking & Deals',
      'weather-forecast-agent': '🌤️ Weather Forecast'
    };
    
    return displayNames[agentName] || agentName;
  }

  // Context extraction methods for each agent
  private extractActivitiesContext(query: string): string {
    const location = this.extractLocation(query) || 'Morocco';
    const interests = this.extractInterests(query);
    return `Find activities and attractions in ${location}. User interests: ${interests}. Query: ${query}`;
  }
  
  private extractFlightContext(query: string): string {
    const origin = this.extractOrigin(query);
    const destination = this.extractDestination(query);
    const dates = this.extractDates(query);
    return `Flight search from ${origin} to ${destination}. Travel dates: ${dates.checkIn} to ${dates.checkOut}. Query: ${query}`;
  }
  
  private extractFoodContext(query: string): string {
    const cuisine = this.extractCuisineType(query);
    const preferences = this.extractTastePreferences(query);
    const restrictions = this.extractDietaryRestrictions(query);
    return `Food recommendations for ${cuisine} cuisine. Preferences: ${preferences}. Restrictions: ${restrictions || 'none'}. Query: ${query}`;
  }
  
  private extractHotelContext(query: string): string {
    const location = this.extractLocation(query) || 'Morocco';
    const budget = this.extractBudget(query);
    const dates = this.extractDates(query);
    const type = this.extractAccommodationType(query);
    return `Hotel search in ${location}. Budget: ${budget}. Dates: ${dates.checkIn} to ${dates.checkOut}. Type: ${type}. Query: ${query}`;
  }
  
  private extractItineraryContext(query: string): string {
    const destination = this.extractLocation(query) || 'Morocco';
    const duration = this.extractDuration(query);
    const interests = this.extractInterests(query);
    return `Create itinerary for ${destination}. Duration: ${duration}. Interests: ${interests}. Query: ${query}`;
  }
  
  private extractRestaurantContext(query: string): string {
    const location = this.extractLocation(query) || 'Morocco';
    const cuisine = this.extractCuisineType(query);
    const budget = this.extractBudget(query);
    return `Restaurant recommendations in ${location}. Cuisine: ${cuisine}. Budget: ${budget}. Query: ${query}`;
  }
  
  private extractBookingContext(query: string): string {
    const service = this.extractBookingService(query);
    const budget = this.extractBudget(query);
    const location = this.extractLocation(query) || 'Morocco';
    return `Travel booking for ${service} in ${location}. Budget: ${budget}. Query: ${query}`;
  }
  
  private extractWeatherContext(query: string): string {
    const location = this.extractLocation(query) || 'Morocco';
    const timeframe = this.extractTimeframe(query);
    return `Weather forecast for ${location}. Timeframe: ${timeframe}. Query: ${query}`;
  }

  // Relevance scoring methods for each agent
  private scoreActivityRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'activities-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreFlightRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'flight-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreFoodRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'food-recommender')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreHotelRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'hotel-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreItineraryRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'morocco-itinerary-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreRestaurantRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'restaurant-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreBookingRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'travel-booking')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }
  
  private scoreWeatherRelevance(query: string): number {
    const agent = this.agentCapabilities.find(a => a.name === 'weather-forecast-agent')!;
    return this.calculateKeywordRelevance(query, agent.keywords);
  }

  // Helper methods for context extraction
  private extractInterests(query: string): string {
    const interests = ['history', 'culture', 'adventure', 'relaxation', 'shopping', 'nature', 'food', 'nightlife'];
    const found = interests.filter(interest => query.toLowerCase().includes(interest));
    return found.length > 0 ? found.join(', ') : 'general tourism';
  }
  
  private extractOrigin(query: string): string {
    const originPatterns = [/from\s+([A-Za-z\s]+?)(?:\s+to|\s*$)/i, /departing\s+([A-Za-z\s]+)/i];
    for (const pattern of originPatterns) {
      const match = query.match(pattern);
      if (match) return match[1].trim();
    }
    return 'your location';
  }
  
  private extractDuration(query: string): string {
    const durationPatterns = [/(\d+)\s+days?/i, /(\d+)\s+weeks?/i, /(\d+)\s+months?/i];
    for (const pattern of durationPatterns) {
      const match = query.match(pattern);
      if (match) return match[0];
    }
    return '1 week';
  }
  
  private extractBookingService(query: string): string {
    const services = ['flight', 'hotel', 'car', 'package', 'tour'];
    const found = services.find(service => query.toLowerCase().includes(service));
    return found || 'travel services';
  }
  
  private extractTimeframe(query: string): string {
    const timeframes = ['today', 'tomorrow', 'this week', 'next week', 'this month'];
    const found = timeframes.find(timeframe => query.toLowerCase().includes(timeframe));
    return found || 'upcoming days';
  }

  /**
   * Calculate keyword-based relevance score
   */
  private calculateKeywordRelevance(query: string, keywords: string[]): number {
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

  /**
   * Check if query is about flights
   */
  private isFlightQuery(query: string): boolean {
    const flightKeywords = ['flight', 'flights', 'plane', 'airplane', 'airline', 'departure', 'arrival', 'airport', 'fly', 'flying'];
    return flightKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about hotels
   */
  private isHotelQuery(query: string): boolean {
    const hotelKeywords = ['hotel', 'hotels', 'accommodation', 'stay', 'room', 'booking', 'check-in', 'check-out'];
    return hotelKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about restaurants
   */
  private isRestaurantQuery(query: string): boolean {
    const restaurantKeywords = ['restaurant', 'restaurants', 'dining', 'eat', 'eating', 'meal', 'breakfast', 'lunch', 'dinner'];
    return restaurantKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about activities
   */
  private isActivitiesQuery(query: string): boolean {
    const activityKeywords = ['activity', 'activities', 'things to do', 'attraction', 'attractions', 'visit', 'sightseeing', 'tour', 'experience'];
    return activityKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about weather
   */
  private isWeatherQuery(query: string): boolean {
    const weatherKeywords = ['weather', 'temperature', 'rain', 'sunny', 'cloudy', 'forecast', 'climate'];
    return weatherKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about research/information
   */
  private isResearchQuery(query: string): boolean {
    const researchKeywords = ['information', 'research', 'learn', 'about', 'history', 'culture', 'tell me', 'what is', 'explain'];
    return researchKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Check if query is about travel booking
   */
  private isTravelBookingQuery(query: string): boolean {
    const bookingKeywords = ['book', 'booking', 'reserve', 'reservation', 'accommodation booking', 'travel booking', 'budget'];
    return bookingKeywords.some(keyword => query.includes(keyword));
  }

  /**
   * Route query to appropriate agent based on content (compatibility method)
   * @deprecated Use orchestrateAgents instead for better multi-agent responses
   */
  async routeQueryToAgent(query: string): Promise<string | null> {
    try {
      const result = await this.orchestrateAgents(query);
      return result.combinedContent;
    } catch (error) {
      console.error('Failed to route query to agent:', error);
      return null;
    }
  }

  /**
   * Call a general agent for text-based responses
   */
  async getGeneralResponse(prompt: string, agentName: string = 'food-recommender'): Promise<string | null> {
    try {
      console.log(`Calling ${agentName} agent with prompt:`, prompt);
      
      const response = await this.callAgent(agentName, prompt);
      if (response && response.query.status.responses.length > 0) {
        return response.query.status.responses[0].content;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to call ${agentName} agent:`, error);
      return null;
    }
  }

  /**
   * Call the food-recommender agent
   */
  async getFoodRecommendations(prompt: string): Promise<FoodRecommendationsPayload | null> {
    try {
      console.log('Calling food-recommender agent with prompt:', prompt);
      
      const response = await this.callAgent('food-recommender', prompt);
      if (response && response.query.status.responses.length > 0) {
        const agentContent = response.query.status.responses[0].content;
        return this.parseAgentResponseToFoodRecommendations(agentContent, prompt);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to call food-recommender agent:', error);
      return null;
    }
  }

  /**
   * Call the travel-booking agent (simulated for browser environment)
   */
  async getAccommodationRecommendations(prompt: string): Promise<AccommodationRecommendationsPayload | null> {
    try {
      console.log('Calling travel-booking agent with prompt:', prompt);
      
      // Try to call a travel agent if available, otherwise return null
      const response = await this.callAgent('travel-booking', prompt);
      if (response && response.query.status.responses.length > 0) {
        const agentContent = response.query.status.responses[0].content;
        return this.parseAgentResponseToAccommodationRecommendations(agentContent, prompt);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to call travel-booking agent:', error);
      return null;
    }
  }

  /**
   * Generic method to call any agent
   */
  private async callAgent(agentName: string, input: string): Promise<AgentResponse | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${this.agentBaseUrl}/${agentName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Agent API Error: ${response.status} ${response.statusText}`);
      }

      // Handle streaming response with timeout
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let result = '';
      const startTime = Date.now();
      const maxDuration = 25000; // 25 seconds for reading response

      while (true) {
        // Check if we've exceeded the reading timeout
        if (Date.now() - startTime > maxDuration) {
          reader.cancel();
          throw new Error('Response reading timeout');
        }

        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        result += chunk;
      }

      clearTimeout(timeoutId);

      // Parse the last data chunk (which should contain the complete response)
      const lines = result.split('\n').filter(line => line.trim());
      const lastDataLine = lines.find(line => line.startsWith('data: '))?.replace('data: ', '');
      
      if (lastDataLine) {
        const parsedResponse = JSON.parse(lastDataLine) as AgentResponse;
        if (parsedResponse.phase === 'done') {
          return parsedResponse;
        }
      }

      return null;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`${agentName} agent request timed out after 30 seconds`);
        throw new Error(`Request to ${agentName} agent timed out. The service may be overloaded or unavailable.`);
      }
      
      // Handle specific network errors
      if (error.message.includes('fetch')) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error(`Cannot connect to ${agentName} agent. Ensure the service is running on localhost:8080.`);
        }
        if (error.message.includes('ECONNREFUSED')) {
          throw new Error(`Connection refused by ${agentName} agent. The service is not responding on localhost:8080.`);
        }
      }
      
      console.error(`Failed to call ${agentName} agent:`, error);
      throw error;
    }
  }

  /**
   * Parse agent response into food recommendations format
   */
  private parseAgentResponseToFoodRecommendations(agentContent: string, originalPrompt: string): FoodRecommendationsPayload | null {
    // Try to extract structured food recommendations from agent response
    // If the response doesn't contain proper food recommendations, return null
    
    if (this.looksLikeFoodRecommendations(agentContent)) {
      return {
        recommendations: [
          {
            name: "Agent Recommended Dish",
            description: agentContent,
            flavor_profile: "Rich and savory",
            key_ingredients: ["Traditional spices", "Local ingredients"],
            cultural_significance: "Traditional dish with cultural importance",
            recipe_link: "#",
            why_matches: "Based on your preferences and agent analysis"
          }
        ],
        taste_preferences: this.extractTastePreferences(originalPrompt),
        cuisine_type: this.extractCuisineType(originalPrompt) || "International",
        dietary_restrictions: this.extractDietaryRestrictions(originalPrompt)
      };
    }

    // If agent response doesn't look like food recommendations, return null
    return null;
  }

  /**
   * Parse agent response into accommodation recommendations format
   */
  private parseAgentResponseToAccommodationRecommendations(agentContent: string, originalPrompt: string): AccommodationRecommendationsPayload | null {
    // Try to extract structured accommodation recommendations from agent response
    // If the response doesn't contain proper accommodation recommendations, return null
    
    if (this.looksLikeAccommodationRecommendations(agentContent)) {
      return {
        recommendations: [
          {
            name: "Agent Recommended Accommodation",
            type: "Hotel",
            description: agentContent,
            key_features: ["WiFi", "Air Conditioning", "Great Location"],
            price_per_night: "$100",
            total_cost: "$500",
            booking_link: "#",
            special_offers: "Book now for special rates",
            why_good_value: "Excellent location and amenities for the price",
            location_score: "9.2/10"
          }
        ],
        destination: this.extractLocation(originalPrompt) || "Morocco",
        budget_per_night: "$100",
        accommodation_type: "Hotel",
        check_in: new Date().toISOString().split('T')[0],
        check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    }

    // If agent response doesn't look like accommodation recommendations, return null
    return null;
  }

  /**
   * Extract location from prompt
   */
  private extractLocation(prompt: string): string | null {
    const locationKeywords = {
      'morocco': 'Morocco',
      'casablanca': 'Casablanca',
      'marrakech': 'Marrakech',
      'rabat': 'Rabat',
      'fes': 'Fes',
      'tangier': 'Tangier'
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [keyword, location] of Object.entries(locationKeywords)) {
      if (lowerPrompt.includes(keyword)) {
        return location;
      }
    }
    return null;
  }

  /**
   * Check if the agent response looks like food recommendations
   */
  private looksLikeFoodRecommendations(content: string): boolean {
    const foodKeywords = ['dish', 'recipe', 'cuisine', 'flavor', 'ingredient', 'taste', 'meal', 'food'];
    const lowercaseContent = content.toLowerCase();
    return foodKeywords.some(keyword => lowercaseContent.includes(keyword));
  }

  /**
   * Check if the agent response looks like accommodation recommendations
   */
  private looksLikeAccommodationRecommendations(content: string): boolean {
    const accommodationKeywords = ['hotel', 'room', 'accommodation', 'stay', 'booking', 'resort', 'lodge', 'riad', 'guesthouse'];
    const lowercaseContent = content.toLowerCase();
    return accommodationKeywords.some(keyword => lowercaseContent.includes(keyword));
  }

  // Helper methods to extract information from prompts
  private extractTastePreferences(prompt: string): string {
    const tasteWords = ['sweet', 'spicy', 'savory', 'sour', 'bitter', 'umami', 'mild', 'hot'];
    const found = tasteWords.filter(word => prompt.toLowerCase().includes(word));
    return found.length > 0 ? found.join(', ') : 'varied tastes';
  }

  private extractCuisineType(prompt: string): string {
    const cuisines = ['moroccan', 'italian', 'french', 'indian', 'chinese', 'japanese', 'mediterranean', 'middle eastern'];
    const found = cuisines.find(cuisine => prompt.toLowerCase().includes(cuisine));
    return found || 'international';
  }

  private extractDietaryRestrictions(prompt: string): string | undefined {
    const restrictions = ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'dairy-free'];
    const found = restrictions.filter(restriction => prompt.toLowerCase().includes(restriction));
    return found.length > 0 ? found.join(', ') : undefined;
  }

  private extractDestination(prompt: string): string {
    // Simple extraction - you might want to make this more sophisticated
    const match = prompt.match(/in\s+([A-Za-z\s]+)/i);
    return match ? match[1].trim() : 'Morocco';
  }

  private extractBudget(prompt: string): string {
    const match = prompt.match(/[\$€]\d+/);
    return match ? match[0] : '€100';
  }

  private extractAccommodationType(prompt: string): string {
    const types = ['hotel', 'hostel', 'apartment', 'resort', 'riad', 'guesthouse'];
    const found = types.find(type => prompt.toLowerCase().includes(type));
    return found || 'hotel';
  }

  private extractDates(prompt: string): { checkIn: string; checkOut: string } {
    // Simple date extraction - you might want to use a proper date parsing library
    const dateRegex = /\d{4}-\d{2}-\d{2}/g;
    const dates = prompt.match(dateRegex);
    
    if (dates && dates.length >= 2) {
      return { checkIn: dates[0], checkOut: dates[1] };
    }
    
    // Default dates
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: nextWeek.toISOString().split('T')[0]
    };
  }

  /**
   * Detect if a query is asking for food recommendations
   */
  detectFoodQuery(query: string): boolean {
    const foodKeywords = [
      'food', 'meal', 'eat', 'restaurant', 'cuisine', 'dish', 'recipe', 'cooking',
      'taste', 'flavor', 'spicy', 'sweet', 'hungry', 'dinner', 'lunch', 'breakfast'
    ];
    return foodKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }

  /**
   * Detect if a query is asking for accommodation recommendations
   */
  detectAccommodationQuery(query: string): boolean {
    const accommodationKeywords = [
      'hotel', 'stay', 'accommodation', 'sleep', 'book', 'riad', 'hostel', 
      'apartment', 'resort', 'lodge', 'guesthouse', 'room', 'night'
    ];
    return accommodationKeywords.some(keyword => query.toLowerCase().includes(keyword));
  }
}

export const agentService = new AgentService();

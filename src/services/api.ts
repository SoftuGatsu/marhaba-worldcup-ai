import { ApiRequest, ApiResponse, FoodRecommendationsPayload, AccommodationRecommendationsPayload } from '@/types/api';
import { agentService } from './agentService';
import { demoService } from './demoService';

class MarhabaApiService {
  private baseUrl = '/api/marhaba'; // This will be proxied to the actual backend
  private agentOnlyMode = import.meta.env.VITE_AGENT_ONLY_MODE === 'true' || false;
  
  async sendMessage(query: string, sessionId: string): Promise<ApiResponse> {
    const request: ApiRequest = {
      query,
      sessionId
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('API request timed out after 30 seconds');
        throw new Error('Request timed out. The service may be overloaded or unavailable.');
      }
      console.error('API call failed:', error);
      throw error;
    }
  }

  /**
   * Send message using agents directly or real backend API
   * This method will first check for demo mode, then try agent service, and fallback to real API
   */
  async sendMessageSmart(query: string, sessionId: string, formData?: any): Promise<ApiResponse> {
    // Check if demo mode is enabled
    if (demoService.isDemoMode()) {
      console.log('Demo mode enabled, generating demo response...');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return demoService.generateDemoResponse(formData || {});
    }

    // If agent-only mode is enabled, only use agents
    if (this.agentOnlyMode) {
      console.log('Agent-only mode enabled, using agent service only');
      return this.sendMessageWithAgentsOnly(query, sessionId);
    }

    // Otherwise, first check if agent service is available
    const isAgentAvailable = await agentService.testConnection();
    
    if (isAgentAvailable) {
      console.log('Using agent service for response');
      return this.sendMessageWithAgentsOnly(query, sessionId);
    } else {
      console.log('Agent service not available, using real backend API');
      try {
        return await this.sendMessage(query, sessionId);
      } catch (error) {
        console.error('Real backend API also failed:', error);
        
        // Provide more specific error messages
        let errorMessage = "I'm sorry, I'm currently unable to process your request.";
        
        if (error.message.includes('timed out') || error.message.includes('timeout')) {
          errorMessage = "The request timed out. This might be because the services are under heavy load or experiencing issues. Please try again in a moment.";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Unable to connect to the backend services. Please ensure the agent services are running on localhost:8080 and try again.";
        }
        
        // Return error response
        return {
          messages: [{
            type: 'text',
            payload: {
              content: errorMessage
            }
          }]
        };
      }
    }
  }

  /**
   * Send message using only agent services (with hardcoded fallbacks for demo)
   */
  async sendMessageWithAgentsOnly(query: string, sessionId: string): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response: ApiResponse = {
      messages: []
    };

    // Use the new multi-agent orchestration
    try {
      const orchestrationResult = await agentService.orchestrateAgents(query);
      
      if (orchestrationResult.combinedContent) {
        response.messages.push({
          type: 'text',
          payload: {
            content: orchestrationResult.combinedContent
          }
        });
      } else {
        // Fallback to hardcoded response
        const hardcodedResponse = this.getHardcodedResponse(query);
        response.messages.push({
          type: 'text',
          payload: {
            content: hardcodedResponse
          }
        });
      }

      // Check if any food-related agent was involved and add structured recommendations
      const foodAgentInvolved = orchestrationResult.responses.some(r => 
        r.agent === 'food-recommender' && r.relevanceScore > 0.3
      );
      
      if (foodAgentInvolved) {
        try {
          const foodRecommendations = await agentService.getFoodRecommendations(query);
          if (foodRecommendations) {
            response.messages.push({
              type: 'food_recommendations',
              payload: foodRecommendations
            });
          }
        } catch (error) {
          console.error('Failed to get food recommendations:', error);
          // Add hardcoded food recommendations
          response.messages.push({
            type: 'food_recommendations',
            payload: this.getHardcodedFoodRecommendations()
          });
        }
      }

      // Check if any hotel-related agent was involved and add structured recommendations
      const hotelAgentInvolved = orchestrationResult.responses.some(r => 
        ['hotel-agent', 'travel-booking'].includes(r.agent) && r.relevanceScore > 0.3
      );
      
      if (hotelAgentInvolved) {
        try {
          const accommodationRecommendations = await agentService.getAccommodationRecommendations(query);
          if (accommodationRecommendations) {
            response.messages.push({
              type: 'accommodation_recommendations',
              payload: accommodationRecommendations
            });
          }
        } catch (error) {
          console.error('Failed to get accommodation recommendations:', error);
          // Add hardcoded accommodation recommendations
          response.messages.push({
            type: 'accommodation_recommendations',
            payload: this.getHardcodedAccommodationRecommendations()
          });
        }
      }

    } catch (error) {
      console.error('Failed to orchestrate agents:', error);
      
      // Fallback to hardcoded response
      const hardcodedResponse = this.getHardcodedResponse(query);
      response.messages.push({
        type: 'text',
        payload: {
          content: hardcodedResponse
        }
      });
    }

    return response;
  }

  /**
   * Get hardcoded response based on query content for demo purposes
   */
  private getHardcodedResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Check for flight-related queries
    if (lowerQuery.includes('flight') || lowerQuery.includes('departure') || lowerQuery.includes('airline')) {
      return `🛫 **Flight Recommendations for Morocco**

Based on your requirements, here are some excellent flight options:

**Recommended Airlines:**
- **Royal Air Maroc** - Morocco's national carrier with direct flights to major Moroccan cities
- **Emirates** - Excellent service with connections via Dubai
- **Turkish Airlines** - Great connections via Istanbul
- **Air France** - Direct flights from Europe

**Best Routes to Morocco:**
- **To Casablanca (CMN)** - Main international hub
- **To Marrakech (RAK)** - Popular tourist destination
- **To Rabat (RBA)** - Capital city

**Tips for booking:**
- Book 2-3 months in advance for best prices
- Consider flying mid-week for lower fares
- Check for World Cup package deals
- Flexible dates can save 20-30%

**Average Flight Costs:**
- From Europe: €200-500
- From North America: $600-1200
- From Middle East: $300-600

Would you like me to help you find specific flights for your dates?`;
    }
    
    // Check for accommodation-related queries
    if (lowerQuery.includes('hotel') || lowerQuery.includes('accommodation') || lowerQuery.includes('stay')) {
      return `🏨 **Accommodation Recommendations for Morocco**

Here are some fantastic places to stay during your Morocco trip:

**Luxury Options:**
- **Royal Mansour, Marrakech** - Ultimate luxury with private riads
- **Four Seasons Casablanca** - Modern luxury on the Atlantic coast
- **Palais Namaskar, Marrakech** - Stunning palace hotel

**Traditional Riads:**
- **Riad El Fenn, Marrakech** - Authentic Moroccan experience
- **Riad Fes** - Beautiful traditional architecture in the medina
- **Dar Ahlam, Skoura** - Desert luxury experience

**Mid-Range Hotels:**
- **Hotel & Spa Les Jardins de l'Agdal** - Great value in Marrakech
- **Barceló Fez** - Modern comfort in Fez
- **Atlas Asni** - Mountain views near Atlas Mountains

**Budget-Friendly:**
- **Riad Atlas Toubkal** - Charming budget riad
- **Hotel Chems** - Clean and comfortable
- **Youth hostels** - Available in major cities

**Booking Tips:**
- Book early for World Cup period
- Consider location relative to stadiums
- Many riads offer airport transfers
- Traditional hammam often included

Would you like specific recommendations based on your budget and preferences?`;
    }
    
    // Check for food-related queries
    if (lowerQuery.includes('food') || lowerQuery.includes('restaurant') || lowerQuery.includes('dining') || lowerQuery.includes('cuisine')) {
      return `🍽️ **Moroccan Cuisine & Dining Guide**

Morocco offers an incredible culinary experience! Here's what you should know:

**Must-Try Dishes:**
- **Tagine** - Slow-cooked stew with meat and vegetables
- **Couscous** - Traditional Friday meal, absolutely delicious
- **Pastilla** - Sweet and savory pie with chicken or pigeon
- **Harira** - Traditional soup, perfect for breaking fast
- **Mint Tea** - Sweet green tea with fresh mint (served everywhere!)

**Best Restaurants:**
- **La Mamounia, Marrakech** - Luxury dining experience
- **Nomad, Marrakech** - Modern Moroccan cuisine
- **Le Jardin, Marrakech** - Beautiful garden setting
- **Restaurant Fes** - Authentic local experience

**Street Food to Try:**
- **Jemaa el-Fnaa** - Famous food square in Marrakech
- **Snail soup** - Local delicacy (don't knock it till you try it!)
- **Fresh orange juice** - Squeezed fresh on every corner
- **Msemen** - Flaky pancakes for breakfast

**Dietary Considerations:**
- Many vegetarian options available
- Halal food everywhere
- Let restaurants know about allergies
- Tap water is generally safe in cities

**Price Ranges:**
- Street food: $2-5 per meal
- Local restaurants: $10-20 per person
- Upscale dining: $30-60 per person

Want specific restaurant recommendations for your destination?`;
    }

    // Check for activity-related queries
    if (lowerQuery.includes('activity') || lowerQuery.includes('attraction') || lowerQuery.includes('things to do') || lowerQuery.includes('tour')) {
      return `🎯 **Amazing Activities & Attractions in Morocco**

Morocco is full of incredible experiences! Here's what you shouldn't miss:

**Historical Sites:**
- **Hassan II Mosque, Casablanca** - One of the largest mosques in the world
- **Bahia Palace, Marrakech** - Stunning 19th-century palace
- **Fez Medina** - UNESCO World Heritage site and largest car-free urban area
- **Ait Benhaddou** - Famous fortified village (seen in many movies!)

**Natural Wonders:**
- **Sahara Desert** - Camel trekking and overnight camping
- **Atlas Mountains** - Hiking and Berber village visits
- **Ouzoud Waterfalls** - Spectacular cascades near Marrakech
- **Atlantic Coast** - Beautiful beaches in Essaouira

**Cultural Experiences:**
- **Jemaa el-Fnaa** - Vibrant square with performers and food
- **Traditional Hammam** - Moroccan spa experience
- **Souk Shopping** - Navigate the bustling marketplaces
- **Cooking Classes** - Learn to make tagine and bread

**Adventure Activities:**
- **Hot Air Ballooning** - Over Marrakech at sunrise
- **Quad Biking** - Through desert landscapes
- **Surfing** - Great waves on the Atlantic coast
- **Rock Climbing** - In the Atlas Mountains

**World Cup Special:**
- **Stadium Tours** - Visit the new World Cup venues
- **Fan Zones** - Experience the tournament atmosphere
- **Football History** - Learn about Moroccan football culture

**Duration Recommendations:**
- Half-day: City tours, cooking classes
- Full-day: Desert trips, mountain excursions
- Multi-day: Sahara expeditions, trekking

What type of activities interest you most?`;
    }

    // Default comprehensive response for general travel queries
    return `🇲🇦 **Welcome to Your Morocco Adventure Planning!**

I'm excited to help you plan an incredible trip to Morocco for the 2030 World Cup! Morocco is a fascinating country that blends ancient traditions with modern hospitality.

**Quick Overview:**
Morocco offers diverse experiences from bustling medinas and stunning palaces to the vast Sahara Desert and Atlantic coastline. The 2030 World Cup will be hosted across multiple cities including Casablanca, Rabat, Marrakech, and Fez.

**What I Can Help You With:**

🛫 **Flights & Transportation**
- Find the best flight deals to Morocco
- Recommend airlines and routes
- Help with domestic travel between cities

🏨 **Accommodation**
- Luxury hotels and traditional riads
- Budget-friendly options
- Location recommendations near stadiums

🍽️ **Food & Dining**
- Must-try Moroccan dishes
- Restaurant recommendations
- Street food guides and safety tips

🎯 **Activities & Sightseeing**
- Historical sites and cultural experiences
- Adventure activities and day trips
- World Cup events and fan experiences

🌤️ **Weather & Planning**
- Best times to visit different regions
- What to pack for your trip
- Cultural etiquette and tips

💰 **Budget Planning**
- Cost estimates for different travel styles
- Money-saving tips and tricks
- Currency and payment advice

**Did You Know?**
- Morocco is only 14km from Europe across the Strait of Gibraltar
- It's home to the world's oldest university (University of al-Qarawiyyin in Fez)
- The 2030 World Cup will be Morocco's first time hosting the tournament!

What specific aspect of your Morocco trip would you like to explore first? I'm here to help make your World Cup adventure unforgettable! 🏆`;
  }

  /**
   * Get hardcoded food recommendations for demo
   */
  private getHardcodedFoodRecommendations(): FoodRecommendationsPayload {
    return {
      recommendations: [
        {
          name: "Traditional Tagine",
          description: "Slow-cooked stew with tender meat, vegetables, and aromatic spices served in a conical clay pot",
          flavor_profile: "Rich, savory, aromatic with warm spices like cinnamon, ginger, and saffron",
          key_ingredients: ["Lamb or chicken", "Vegetables", "Preserved lemons", "Olives", "Moroccan spices"],
          cultural_significance: "The national dish of Morocco, traditionally cooked and served in the conical tagine pot",
          recipe_link: "https://example.com/tagine-recipe",
          why_matches: "Perfect introduction to Moroccan cuisine with its balance of sweet and savory flavors"
        },
        {
          name: "Couscous Royale",
          description: "Traditional Friday meal with fluffy couscous, seven vegetables, and your choice of meat",
          flavor_profile: "Light, fluffy, and comforting with subtle vegetable and meat flavors",
          key_ingredients: ["Semolina couscous", "Seven vegetables", "Lamb or chicken", "Chickpeas", "Moroccan spices"],
          cultural_significance: "Traditional Friday meal after mosque prayers, representing family gathering",
          recipe_link: "https://example.com/couscous-recipe",
          why_matches: "A complete meal that showcases the variety and richness of Moroccan cooking"
        },
        {
          name: "Pastilla (B'stilla)",
          description: "Delicate pastry filled with spiced pigeon or chicken, almonds, and powdered sugar",
          flavor_profile: "Sweet and savory combination with crispy pastry and rich, spiced filling",
          key_ingredients: ["Phyllo pastry", "Pigeon or chicken", "Almonds", "Eggs", "Cinnamon", "Powdered sugar"],
          cultural_significance: "Festive dish served at special occasions and celebrations",
          recipe_link: "https://example.com/pastilla-recipe",
          why_matches: "Unique sweet-savory combination that exemplifies Morocco's sophisticated cuisine"
        },
        {
          name: "Mint Tea & Chebakia",
          description: "Sweet green tea with fresh mint served with honey-soaked sesame cookies",
          flavor_profile: "Refreshing mint tea with sweet, floral honey-soaked cookies",
          key_ingredients: ["Green tea", "Fresh mint", "Sugar", "Sesame seeds", "Honey", "Orange blossom water"],
          cultural_significance: "Symbol of Moroccan hospitality, served to welcome guests",
          recipe_link: "https://example.com/mint-tea-recipe",
          why_matches: "Essential Moroccan experience that represents the warmth of Moroccan hospitality"
        }
      ],
      taste_preferences: "Balanced flavors with aromatic spices",
      cuisine_type: "Traditional Moroccan",
      dietary_restrictions: "Halal options available, vegetarian modifications possible"
    };
  }

  /**
   * Get hardcoded accommodation recommendations for demo
   */
  private getHardcodedAccommodationRecommendations(): AccommodationRecommendationsPayload {
    return {
      recommendations: [
        {
          name: "Royal Mansour Marrakech",
          type: "Luxury Hotel",
          description: "Ultra-luxury hotel with private riads, world-class spa, and exceptional Moroccan hospitality",
          key_features: ["Private riads", "World-class spa", "Michelin-starred dining", "Rooftop terraces", "Butler service"],
          price_per_night: "$1000-2000",
          total_cost: "$7000-14000 for 7 nights",
          booking_link: "https://royalmansour.com",
          special_offers: "World Cup package with match tickets included",
          why_good_value: "Unparalleled luxury experience with authentic Moroccan architecture and service",
          location_score: "9.5/10 - Heart of Marrakech medina"
        },
        {
          name: "Riad El Fenn",
          type: "Traditional Riad",
          description: "Stunning traditional riad with contemporary art, beautiful courtyards, and rooftop terraces",
          key_features: ["Contemporary art collection", "Multiple courtyards", "Rooftop pool", "Traditional architecture", "Spa services"],
          price_per_night: "$300-500",
          total_cost: "$2100-3500 for 7 nights",
          booking_link: "https://riadelfenn.com",
          special_offers: "Extended stay discount for 7+ nights",
          why_good_value: "Perfect blend of traditional Moroccan style with modern luxury amenities",
          location_score: "9.0/10 - Walking distance to Jemaa el-Fnaa"
        },
        {
          name: "Four Seasons Casablanca",
          type: "Modern Hotel",
          description: "Modern luxury hotel on the Atlantic coast with ocean views and world-class amenities",
          key_features: ["Ocean views", "Modern amenities", "Spa and fitness center", "Business facilities", "Multiple restaurants"],
          price_per_night: "$400-700",
          total_cost: "$2800-4900 for 7 nights",
          booking_link: "https://fourseasons.com/casablanca",
          special_offers: "Airport transfer included with 3+ night stays",
          why_good_value: "International luxury standards with prime Casablanca location",
          location_score: "8.5/10 - Beachfront location near business district"
        },
        {
          name: "Atlas Asni Hotel",
          type: "Mountain Lodge",
          description: "Charming mountain hotel with stunning Atlas Mountains views and traditional Berber hospitality",
          key_features: ["Mountain views", "Hiking trails access", "Traditional Berber architecture", "Local cuisine", "Stargazing opportunities"],
          price_per_night: "$80-150",
          total_cost: "$560-1050 for 7 nights",
          booking_link: "https://atlasasni.com",
          special_offers: "Hiking guide included with 2+ night stays",
          why_good_value: "Authentic mountain experience with excellent value for money",
          location_score: "8.0/10 - Gateway to High Atlas Mountains"
        }
      ],
      destination: "Morocco",
      budget_per_night: "Flexible",
      accommodation_type: "Mixed - Luxury to Budget",
      check_in: "TBD",
      check_out: "TBD"
    };
  }
}

export const marhabaApi = new MarhabaApiService();
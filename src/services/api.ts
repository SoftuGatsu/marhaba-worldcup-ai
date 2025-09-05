import { ApiRequest, ApiResponse } from '@/types/api';
import { agentService } from './agentService';

class MarhabaApiService {
  private baseUrl = '/api/marhaba'; // This will be proxied to the actual backend
  
  async sendMessage(query: string, sessionId: string): Promise<ApiResponse> {
    const request: ApiRequest = {
      query,
      sessionId
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Enhanced API with agent integration for development/demo purposes
  async sendMessageMock(query: string, sessionId: string): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponse: ApiResponse = {
      messages: [
        {
          type: 'text',
          payload: {
            content: `Great question! Here's what I found for your request: "${query}". Morocco offers incredible experiences during the 2030 World Cup.`
          }
        }
      ]
    };

    // Check if the query is asking for food recommendations
    if (agentService.detectFoodQuery(query)) {
      try {
        const foodRecommendations = await agentService.getFoodRecommendations(query);
        if (foodRecommendations) {
          mockResponse.messages.push({
            type: 'food_recommendations',
            payload: foodRecommendations
          });
        }
      } catch (error) {
        console.error('Failed to get food recommendations:', error);
        // Fallback to mock food recommendations
        mockResponse.messages.push({
          type: 'food_recommendations',
          payload: {
            recommendations: [
              {
                name: 'Tagine Djaj',
                description: 'Traditional Moroccan chicken stew slow-cooked with preserved lemons and olives',
                flavor_profile: 'Rich, aromatic, and mildly spicy with citrus notes',
                key_ingredients: ['Chicken', 'Preserved lemons', 'Olives', 'Ginger', 'Saffron'],
                cultural_significance: 'A cornerstone of Moroccan cuisine, traditionally served during special occasions',
                recipe_link: 'https://www.allrecipes.com/recipe/moroccan-chicken-tagine',
                why_matches: 'Perfect balance of savory and citrus flavors matching your taste preferences'
              },
              {
                name: 'Pastilla',
                description: 'Sweet and savory pastry with pigeon or chicken, almonds, and cinnamon',
                flavor_profile: 'Unique blend of sweet cinnamon and savory meat',
                key_ingredients: ['Phyllo pastry', 'Chicken', 'Almonds', 'Cinnamon', 'Sugar'],
                cultural_significance: 'Traditional festive dish often served at weddings and celebrations',
                recipe_link: 'https://www.foodnetwork.com/recipes/moroccan-pastilla',
                why_matches: 'Offers an adventurous mix of sweet and savory flavors'
              }
            ],
            taste_preferences: 'savory with citrus notes',
            cuisine_type: 'Moroccan',
            dietary_restrictions: undefined
          }
        });
      }
    }

    // Check if the query is asking for accommodation recommendations
    if (agentService.detectAccommodationQuery(query)) {
      try {
        const accommodationRecommendations = await agentService.getAccommodationRecommendations(query);
        if (accommodationRecommendations) {
          mockResponse.messages.push({
            type: 'accommodation_recommendations',
            payload: accommodationRecommendations
          });
        }
      } catch (error) {
        console.error('Failed to get accommodation recommendations:', error);
        // Fallback to mock accommodation recommendations
        mockResponse.messages.push({
          type: 'accommodation_recommendations',
          payload: {
            recommendations: [
              {
                name: 'Riad Yasmine',
                type: 'Traditional Riad',
                description: 'Beautifully restored traditional riad in the heart of Marrakech medina',
                key_features: ['Rooftop terrace', 'Traditional architecture', 'Central courtyard', 'Free WiFi'],
                price_per_night: '€120',
                total_cost: '€480 (4 nights)',
                booking_link: 'https://www.booking.com/riad-yasmine',
                special_offers: 'Free breakfast included for World Cup visitors',
                why_good_value: 'Authentic Moroccan experience in prime location with excellent amenities',
                location_score: '4.8/5'
              },
              {
                name: 'Hotel Atlas Medina',
                type: 'Boutique Hotel',
                description: 'Modern comfort meets traditional Moroccan style',
                key_features: ['Pool', 'Spa', 'Restaurant', 'Air conditioning'],
                price_per_night: '€95',
                total_cost: '€380 (4 nights)',
                booking_link: 'https://www.expedia.com/hotel-atlas-medina',
                special_offers: null,
                why_good_value: 'Great amenities at competitive price with easy access to stadium',
                location_score: '4.6/5'
              }
            ],
            destination: 'Marrakech',
            budget_per_night: '€150',
            accommodation_type: 'hotel',
            check_in: '2030-06-15',
            check_out: '2030-06-19'
          }
        });
      }
    }

    if (query.toLowerCase().includes('itinerary') || query.toLowerCase().includes('plan')) {
      mockResponse.messages.push({
        type: 'itinerary_day',
        payload: {
          day: 1,
          date: '2030-07-12',
          title: 'Arrival & Medina Exploration',
          events: [
            {
              time: '14:00',
              title: 'Check into Riad',
              description: 'Settle into your eco-friendly Riad in the heart of the Medina.',
              map_link: 'https://maps.google.com/?q=Marrakech+Medina'
            },
            {
              time: '16:00',
              title: 'Jemaa el-Fnaa Square',
              description: 'Experience the vibrant heart of the city with street performers and local cuisine.',
              map_link: 'https://maps.google.com/?q=Jemaa+el-Fnaa'
            },
            {
              time: '19:30',
              title: 'Dinner at Nomad',
              description: 'Enjoy modern Moroccan cuisine with a stunning rooftop view of the medina.',
              map_link: 'https://maps.google.com/?q=Nomad+Restaurant+Marrakech'
            }
          ]
        }
      });
    }

    if (query.toLowerCase().includes('flight')) {
      mockResponse.messages.push({
        type: 'flight_details',
        payload: {
          airline: 'Royal Air Maroc',
          logo_url: 'https://logos-world.net/wp-content/uploads/2023/01/Royal-Air-Maroc-Logo.png',
          departure: {
            code: 'JFK',
            city: 'New York',
            time: '22:00'
          },
          arrival: {
            code: 'RAK',
            city: 'Marrakesh',
            time: '11:30'
          },
          price: '€850',
          carbon_offset: 'Included',
          booking_link: 'https://www.royalairmaroc.com'
        }
      });
    }

    return mockResponse;
  }
}

export const marhabaApi = new MarhabaApiService();
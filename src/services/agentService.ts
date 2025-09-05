import { FoodRecommendationsPayload, AccommodationRecommendationsPayload } from '@/types/api';

class AgentService {
  /**
   * Call the food-recommender agent (simulated for browser environment)
   */
  async getFoodRecommendations(prompt: string): Promise<FoodRecommendationsPayload | null> {
    try {
      // In a real implementation, this would make an API call to your backend
      // which would then call the agent. For now, we'll simulate intelligent responses.
      
      console.log('Calling food-recommender agent with prompt:', prompt);
      
      // Simulate agent processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual recommendations based on the prompt
      return this.generateMockFoodRecommendations(prompt);
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
      
      // Simulate agent processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual recommendations based on the prompt
      return this.generateMockAccommodationRecommendations(prompt);
    } catch (error) {
      console.error('Failed to call travel-booking agent:', error);
      return null;
    }
  }

  /**
   * Generate intelligent mock food recommendations based on the prompt
   */
  private generateMockFoodRecommendations(prompt: string): FoodRecommendationsPayload {
    const tastePreferences = this.extractTastePreferences(prompt);
    const cuisineType = this.extractCuisineType(prompt);
    const dietaryRestrictions = this.extractDietaryRestrictions(prompt);

    // Different recommendation sets based on detected preferences
    let recommendations;
    
    if (cuisineType.includes('moroccan')) {
      recommendations = [
        {
          name: 'Tagine Lamb with Apricots',
          description: 'Tender lamb slow-cooked with sweet apricots, almonds, and warm spices in a traditional clay tagine',
          flavor_profile: 'Sweet and savory with warm spices, tender meat with dried fruit sweetness',
          key_ingredients: ['Lamb', 'Dried apricots', 'Almonds', 'Cinnamon', 'Ginger', 'Saffron'],
          cultural_significance: 'A beloved dish served during special occasions, representing the perfect balance of sweet and savory in Moroccan cuisine',
          recipe_link: 'https://www.bbcgoodfood.com/recipes/lamb-apricot-tagine',
          why_matches: tastePreferences.includes('sweet') ? 'Perfect for your sweet tooth with dried apricots and honey' : 'Rich, complex flavors that satisfy hearty appetites'
        },
        {
          name: 'Harira Soup',
          description: 'Traditional tomato-based soup with lentils, chickpeas, fresh herbs, and warming spices',
          flavor_profile: 'Rich, hearty, and warming with a perfect blend of spices and fresh herbs',
          key_ingredients: ['Tomatoes', 'Lentils', 'Chickpeas', 'Cilantro', 'Parsley', 'Ginger'],
          cultural_significance: 'Traditionally eaten to break fast during Ramadan, symbolizing nourishment and community',
          recipe_link: 'https://www.allrecipes.com/recipe/harira-soup',
          why_matches: tastePreferences.includes('spicy') ? 'Warming spices provide gentle heat' : 'Comforting and satisfying with rich umami flavors'
        },
        {
          name: 'Pastilla Royale',
          description: 'Delicate phyllo pastry filled with spiced pigeon or chicken, almonds, and cinnamon sugar',
          flavor_profile: 'Unique sweet-savory combination with crispy pastry and aromatic filling',
          key_ingredients: ['Phyllo pastry', 'Chicken', 'Almonds', 'Cinnamon', 'Sugar', 'Eggs'],
          cultural_significance: 'Crown jewel of Moroccan cuisine, served at weddings and royal feasts',
          recipe_link: 'https://www.seriouseats.com/moroccan-pastilla-recipe',
          why_matches: 'Adventurous flavor combination perfect for those seeking authentic Moroccan experience'
        }
      ];
    } else if (cuisineType.includes('italian')) {
      recommendations = [
        {
          name: 'Osso Buco alla Milanese',
          description: 'Braised veal shanks with vegetables, white wine, and broth, served with risotto',
          flavor_profile: 'Rich, hearty, and deeply savory with tender meat falling off the bone',
          key_ingredients: ['Veal shanks', 'White wine', 'Tomatoes', 'Onions', 'Carrots', 'Celery'],
          cultural_significance: 'Traditional Lombard dish from Milan, representing northern Italian comfort food',
          recipe_link: 'https://www.foodnetwork.com/recipes/osso-buco',
          why_matches: 'Perfect for meat lovers seeking rich, satisfying flavors'
        },
        {
          name: 'Risotto ai Porcini',
          description: 'Creamy Arborio rice with wild porcini mushrooms, Parmesan, and white wine',
          flavor_profile: 'Earthy, creamy, and umami-rich with deep mushroom flavors',
          key_ingredients: ['Arborio rice', 'Porcini mushrooms', 'Parmesan', 'White wine', 'Shallots'],
          cultural_significance: 'Represents the art of patience in Italian cooking, stirring to perfection',
          recipe_link: 'https://www.bbcgoodfood.com/recipes/porcini-mushroom-risotto',
          why_matches: dietaryRestrictions?.includes('vegetarian') ? 'Rich vegetarian option with deep umami flavors' : 'Sophisticated flavors for discerning palates'
        }
      ];
    } else {
      // Default international recommendations
      recommendations = [
        {
          name: 'Mediterranean Grilled Sea Bass',
          description: 'Fresh sea bass grilled with olive oil, lemon, herbs, and served with roasted vegetables',
          flavor_profile: 'Light, fresh, and healthy with bright Mediterranean flavors',
          key_ingredients: ['Sea bass', 'Olive oil', 'Lemon', 'Rosemary', 'Thyme', 'Garlic'],
          cultural_significance: 'Represents the healthy Mediterranean diet and coastal cooking traditions',
          recipe_link: 'https://www.allrecipes.com/recipe/grilled-sea-bass',
          why_matches: 'Perfect balance of protein and fresh flavors for health-conscious diners'
        },
        {
          name: 'Thai Green Curry',
          description: 'Aromatic coconut curry with green chilies, Thai basil, and your choice of protein',
          flavor_profile: 'Spicy, aromatic, and creamy with complex layers of heat and freshness',
          key_ingredients: ['Green curry paste', 'Coconut milk', 'Thai basil', 'Lemongrass', 'Galangal'],
          cultural_significance: 'Central Thai dish representing the balance of spicy, sweet, sour, and salty',
          recipe_link: 'https://www.bbcgoodfood.com/recipes/thai-green-curry',
          why_matches: tastePreferences.includes('spicy') ? 'Perfect heat level with cooling coconut milk' : 'Exotic flavors for adventurous eaters'
        }
      ];
    }

    return {
      recommendations,
      taste_preferences: tastePreferences,
      cuisine_type: cuisineType,
      dietary_restrictions: dietaryRestrictions
    };
  }

  /**
   * Generate intelligent mock accommodation recommendations based on the prompt
   */
  private generateMockAccommodationRecommendations(prompt: string): AccommodationRecommendationsPayload {
    const destination = this.extractDestination(prompt);
    const budgetPerNight = this.extractBudget(prompt);
    const accommodationType = this.extractAccommodationType(prompt);
    const { checkIn, checkOut } = this.extractDates(prompt);

    // Different recommendation sets based on detected preferences
    let recommendations;
    
    if (destination.toLowerCase().includes('marrakech') || destination.toLowerCase().includes('morocco')) {
      recommendations = [
        {
          name: 'Riad Al Massarah',
          type: 'Traditional Riad',
          description: 'Authentic 18th-century riad with stunning mosaics, peaceful courtyards, and rooftop terraces overlooking the Atlas Mountains',
          key_features: ['Rooftop terrace', 'Traditional hammam', 'Courtyard pool', 'Authentic architecture', 'Free WiFi'],
          price_per_night: '€140',
          total_cost: '€560 (4 nights)',
          booking_link: 'https://www.booking.com/hotel/ma/riad-al-massarah',
          special_offers: 'Free traditional Moroccan breakfast and airport transfer for World Cup guests',
          why_good_value: 'Authentic Moroccan experience with luxury amenities in prime medina location, walking distance to main square',
          location_score: '4.9/5'
        },
        {
          name: 'Hotel & Spa Naoura Barrière',
          type: 'Luxury Hotel',
          description: 'Contemporary luxury hotel with world-class spa, multiple restaurants, and modern Moroccan design',
          key_features: ['Luxury spa', 'Multiple pools', 'Fine dining', 'Fitness center', 'Concierge service'],
          price_per_night: '€280',
          total_cost: '€1,120 (4 nights)',
          booking_link: 'https://www.expedia.com/hotel-naoura-barriere',
          special_offers: 'Spa credit and room upgrade available during World Cup period',
          why_good_value: 'Five-star luxury with exceptional service and prime location near Hivernage district',
          location_score: '4.8/5'
        },
        {
          name: 'Equity Point Marrakech Hostel',
          type: 'Modern Hostel',
          description: 'Stylish hostel with Moroccan-inspired design, rooftop bar, and social atmosphere perfect for travelers',
          key_features: ['Rooftop bar', 'Shared kitchen', 'Luggage storage', 'Common areas', '24/7 reception'],
          price_per_night: '€35',
          total_cost: '€140 (4 nights)',
          booking_link: 'https://www.hostelworld.com/equity-point-marrakech',
          special_offers: 'Free walking tour of medina included',
          why_good_value: 'Budget-friendly option with great social atmosphere and central location',
          location_score: '4.5/5'
        }
      ];
    } else {
      // Default recommendations for other destinations
      recommendations = [
        {
          name: 'Grand Hotel Central',
          type: 'Boutique Hotel',
          description: 'Elegant boutique hotel with contemporary design and excellent service in city center',
          key_features: ['Central location', 'Restaurant', 'Bar', 'Fitness center', 'Business center'],
          price_per_night: budgetPerNight,
          total_cost: `${budgetPerNight} x nights`,
          booking_link: 'https://www.booking.com/grand-hotel-central',
          special_offers: 'Early bird booking discount available',
          why_good_value: 'Perfect location with modern amenities at competitive rates',
          location_score: '4.6/5'
        },
        {
          name: 'Urban Nest Apartments',
          type: 'Serviced Apartment',
          description: 'Modern apartments with kitchenette, perfect for longer stays and family groups',
          key_features: ['Kitchenette', 'Living area', 'Washing machine', 'Free WiFi', 'Weekly cleaning'],
          price_per_night: `€${Math.floor(parseInt(budgetPerNight.replace(/[€$]/, '')) * 0.8)}`,
          total_cost: `€${Math.floor(parseInt(budgetPerNight.replace(/[€$]/, '')) * 0.8 * 4)} (4 nights)`,
          booking_link: 'https://www.airbnb.com/urban-nest-apartments',
          special_offers: null,
          why_good_value: 'Apartment-style comfort with hotel amenities, great for families or extended stays',
          location_score: '4.4/5'
        }
      ];
    }

    return {
      recommendations,
      destination,
      budget_per_night: budgetPerNight,
      accommodation_type: accommodationType,
      check_in: checkIn,
      check_out: checkOut
    };
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

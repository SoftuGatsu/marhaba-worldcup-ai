import { ApiResponse, FoodRecommendationsPayload, AccommodationRecommendationsPayload } from '@/types/api';

interface DemoFormData {
  // Flight Agent
  departure_city: string;
  departure_date: string;
  return_date: string;
  passengers: string;
  class_preference: string;
  airline_preference: string;
  flexible_dates: boolean;
  
  // Hotel Agent
  check_in_date: string;
  check_out_date: string;
  guests: string;
  room_type: string;
  hotel_preference: string;
  amenities: string[];
  budget_range: string;
  
  // Food Recommender Agent
  dietary_restrictions: string[];
  cuisine_preferences: string[];
  meal_types: string[];
  food_budget: string;
  spice_tolerance: string;
  
  // Restaurant Agent
  restaurant_type: string;
  dining_occasion: string;
  group_size: string;
  location_preference: string;
  restaurant_budget: string;
  
  // Activities Agent
  activity_types: string[];
  age_group: string;
  physical_level: string;
  duration_preference: string;
  indoor_outdoor: string;
  cultural_interests: string[];
  
  // Weather Agent
  weather_concerns: string[];
  seasonal_preferences: string;
  activities_weather_dependent: boolean;
  
  // Research Agent
  research_topics: string[];
  information_depth: string;
  specific_questions: string;
  
  // Travel Booking Agent
  package_type: string;
  booking_timeline: string;
  special_requirements: string;
  contact_preferences: string[];
  
  // General
  destination: string;
  travel_dates: string;
  budget: string;
  special_notes: string;
}

interface DemoScenario {
  name: string;
  description: string;
  formValues: Partial<DemoFormData>;
  response: ApiResponse;
}

class DemoService {
  private demoScenarios: DemoScenario[] = [
    {
      name: "Luxury Marrakech Experience",
      description: "High-end family trip to Marrakech with cultural interests and fine dining",
      formValues: {
        destination: "Marrakech",
        passengers: "4",
        class_preference: "business",
        guests: "4",
        hotel_preference: "luxury",
        budget_range: "luxury",
        amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
        cuisine_preferences: ["Moroccan Traditional", "Fine Dining"],
        spice_tolerance: "medium",
        food_budget: "luxury",
        activity_types: ["Historical Sites", "Museums", "Cultural Shows", "Cooking Classes"],
        cultural_interests: ["Architecture", "Art & Crafts", "History"],
        physical_level: "moderate",
        budget: "$8000-12000",
        package_type: "full-package",
        seasonal_preferences: "spring"
      },
      response: {
        messages: [
          {
            type: 'text',
            payload: {
              content: `# 🏰 Your Luxury Marrakech Experience

Welcome to an extraordinary journey through the Red City! Based on your preferences for luxury accommodations, cultural immersion, and fine dining, I've crafted the perfect Marrakech experience for your family of 4.

## ✈️ **Premium Flight Experience**
**Business Class with Royal Air Maroc**
- Direct flights to Marrakech-Menara Airport
- Priority check-in and lounge access
- Extra baggage allowance for your shopping treasures
- Estimated cost: $3,200 per person

## 🏨 **Luxury Accommodation: La Mamounia**
**The Palace of Marrakech**
- **Location**: Historic Hivernage district, walking distance to Medina
- **Room Type**: Family Suite with garden view
- **Amenities**: 
  - Private terrace overlooking the Atlas Mountains
  - Access to multiple pools and world-class spa
  - Michelin-starred restaurants on-site
  - 24/7 concierge service
- **Cost**: $800/night (4 nights = $3,200)

## 🍽️ **Culinary Journey**
**Fine Dining Experiences:**
- **Le Pavillon**: French-Moroccan fusion at La Mamounia
- **Dar Yacout**: Traditional palace dining experience
- **Al Fassia**: Authentic Moroccan cuisine run by women
- **Private Cooking Class**: Learn tagine secrets in a traditional riad

**Daily Food Budget**: $200/day for family dining experiences

## 🎯 **Cultural Immersion Activities**

### Day 1: Historic Marrakech
- **Morning**: Private guided tour of Bahia Palace and Saadian Tombs
- **Afternoon**: Majorelle Garden and Yves Saint Laurent Museum
- **Evening**: Sunset dinner at Dar Yacout

### Day 2: Artisan Quarter
- **Morning**: Private pottery and tile-making workshop
- **Afternoon**: Guided souk tour with personal shopper
- **Evening**: Traditional Gnawa music performance

### Day 3: Atlas Mountains Excursion
- **Full Day**: Private driver to Atlas Mountains
- **Activities**: Berber village visit, traditional lunch, light hiking
- **Return**: Evening relaxation at La Mamounia spa

### Day 4: Cooking & Farewell
- **Morning**: Private cooking class in traditional riad
- **Afternoon**: Leisure time, final shopping
- **Evening**: Farewell dinner at Le Pavillon

## 🌟 **Special Cultural Experiences**
- Private calligraphy workshop
- Traditional henna ceremony for the family
- Storytelling session in Jemaa el-Fnaa
- Carpet weaving demonstration

## 💰 **Investment Summary**
- **Flights**: $12,800 (4 x $3,200)
- **Accommodation**: $3,200 (4 nights luxury)
- **Food & Dining**: $800 (4 days premium)
- **Activities & Tours**: $1,200
- **Total Estimated**: $18,000

This luxury experience perfectly balances cultural authenticity with five-star comfort, ensuring your family creates unforgettable memories in Morocco's most enchanting city!`
            }
          },
          {
            type: 'accommodation_recommendations',
            payload: {
              recommendations: [
                {
                  name: "La Mamounia",
                  type: "Luxury Palace Hotel",
                  description: "Legendary palace hotel in the heart of Marrakech, favored by royalty and celebrities for over a century",
                  key_features: ["Historic palace architecture", "Award-winning spa", "4 restaurants", "Private gardens", "Concierge service"],
                  price_per_night: "$800-1200",
                  total_cost: "$3200-4800 for 4 nights",
                  booking_link: "https://mamounia.com",
                  special_offers: "Complimentary spa treatment with 3+ night stays",
                  why_good_value: "Unmatched luxury and history in the heart of Marrakech",
                  location_score: "10/10 - Prime location near Medina and modern city"
                },
                {
                  name: "Royal Mansour",
                  type: "Ultra-Luxury Riad",
                  description: "Exceptional luxury with private riads, world-class spa, and impeccable Moroccan hospitality",
                  key_features: ["Private riads", "Michelin-starred dining", "Rooftop terraces", "Butler service", "Spa sanctuary"],
                  price_per_night: "$1500-2500",
                  total_cost: "$6000-10000 for 4 nights",
                  booking_link: "https://royalmansour.com",
                  special_offers: "Private airport transfer in Rolls Royce",
                  why_good_value: "Ultimate Moroccan luxury experience with unparalleled service",
                  location_score: "9.5/10 - Heart of the historic Medina"
                }
              ],
              destination: "Marrakech",
              budget_per_night: "$800-1200",
              accommodation_type: "Luxury Hotel",
              check_in: "2025-04-15",
              check_out: "2025-04-19"
            }
          },
          {
            type: 'food_recommendations',
            payload: {
              recommendations: [
                {
                  name: "Royal Tagine Experience",
                  description: "Exquisite lamb tagine with apricots and almonds, slow-cooked in a traditional earthenware pot",
                  flavor_profile: "Rich and aromatic with sweet and savory notes, medium spice level perfect for refined palates",
                  key_ingredients: ["Premium lamb", "Dried apricots", "Almonds", "Moroccan spices", "Preserved lemons"],
                  cultural_significance: "Represents the pinnacle of Moroccan royal cuisine, served at palace feasts",
                  recipe_link: "#",
                  why_matches: "Perfect for your luxury dining preferences with sophisticated flavors"
                },
                {
                  name: "Pastilla Royale",
                  description: "Delicate layers of phyllo pastry filled with spiced pigeon, almonds, and subtle sweetness",
                  flavor_profile: "Elegant sweet-savory combination with crispy texture and refined presentation",
                  key_ingredients: ["Phyllo pastry", "Spiced pigeon", "Almonds", "Cinnamon", "Powdered sugar"],
                  cultural_significance: "Traditional feast dish served at royal celebrations and special occasions",
                  recipe_link: "#",
                  why_matches: "Sophisticated dish that showcases Morocco's refined culinary artistry"
                }
              ],
              taste_preferences: "Medium spice, sophisticated flavors",
              cuisine_type: "Moroccan Traditional",
              dietary_restrictions: "None specified"
            }
          }
        ]
      }
    },
    {
      name: "Budget Adventure Fez Trip",
      description: "Affordable solo backpacker experience in Fez with cultural exploration",
      formValues: {
        destination: "Fez",
        passengers: "1",
        class_preference: "economy",
        guests: "1",
        hotel_preference: "budget",
        budget_range: "budget",
        amenities: ["WiFi"],
        cuisine_preferences: ["Moroccan Traditional", "Street Food"],
        spice_tolerance: "hot",
        food_budget: "budget",
        activity_types: ["Historical Sites", "Souks/Markets", "Cultural Shows"],
        cultural_interests: ["Architecture", "History", "Local Traditions"],
        physical_level: "high",
        budget: "$1500-2000",
        package_type: "individual",
        seasonal_preferences: "winter"
      },
      response: {
        messages: [
          {
            type: 'text',
            payload: {
              content: `# 🎒 Budget Adventure in Historic Fez

Get ready for an authentic Moroccan adventure in the world's oldest medieval city! Your budget-conscious journey through Fez will be packed with cultural discoveries and unforgettable experiences.

## ✈️ **Economy Flight Options**
**Budget Airlines to Fez**
- **Royal Air Maroc**: Economy class with good value
- **Ryanair**: Connections via European hubs
- **TAP Air Portugal**: Affordable connections
- **Estimated cost**: $400-600 roundtrip

## 🏠 **Budget Accommodation: Riad Layla**
**Authentic Medina Experience**
- **Location**: Heart of Fez Medina, walking distance to all attractions
- **Room Type**: Traditional shared riad room
- **Amenities**: 
  - Free WiFi throughout
  - Shared traditional bathrooms
  - Rooftop terrace with medina views
  - Breakfast included (traditional Moroccan bread and tea)
- **Cost**: $25/night (7 nights = $175)

## 🍽️ **Street Food Adventure**
**Authentic Local Dining:**
- **Local Cafés**: Traditional breakfast with mint tea ($3-5)
- **Street Food**: Fresh tagines from local vendors ($5-8)
- **Medina Eateries**: Authentic harira soup and bread ($2-4)
- **Market Snacks**: Dates, nuts, and fresh orange juice ($1-3)

**Daily Food Budget**: $15-20/day for authentic local cuisine

## 🎯 **Cultural Immersion on a Budget**

### Day 1-2: Fez el-Bali (Old Medina)
- **Free walking tour** of the UNESCO World Heritage medina
- **Al-Qarawiyyin University**: World's oldest continuously operating university
- **Chouara Tannery**: Traditional leather-making process
- **Cost**: Free tours + $5 tips

### Day 3-4: Artisan Quarters
- **Pottery workshops**: Watch traditional ceramics being made
- **Weaving cooperatives**: See traditional carpet creation
- **Metalwork souks**: Browse incredible handcrafted items
- **Bargaining practice**: Perfect your souk negotiation skills

### Day 5-6: Religious & Historical Sites
- **Bou Inania Madrasa**: Stunning Islamic architecture
- **Dar Batha Museum**: Moroccan arts and crafts
- **Jewish Quarter (Mellah)**: Historical multicultural heritage
- **Ibn Danan Synagogue**: Unique cultural perspective

### Day 7: Atlas Mountains Day Trip
- **Local bus to Ifrane**: "Switzerland of Morocco" ($5)
- **Hiking in cedar forests**: Free natural experience
- **Picnic lunch**: Local market supplies ($10)
- **Return by evening**: Perfect budget day out

## 🌟 **Free Cultural Experiences**
- Traditional music performances in Jemaa el-Fnaa
- Sunset views from rooftop terraces
- Morning prayer calls throughout the medina
- Traditional bread-making observations
- Local market wandering and people-watching

## 📚 **Historical Discovery**
- **1,200-year-old medina**: Largest car-free urban area in the world
- **Traditional crafts**: Unchanged for centuries
- **Living history**: Experience medieval Islamic civilization
- **Cultural immersion**: Authentic Moroccan daily life

## 💰 **Budget Breakdown**
- **Flight**: $500 (economy roundtrip)
- **Accommodation**: $175 (7 nights budget riad)
- **Food**: $140 (7 days street food)
- **Activities**: $100 (tours, transport, entries)
- **Shopping**: $200 (souvenirs, crafts)
- **Miscellaneous**: $85 (tips, extras)
- **Total**: $1,200

## 🎯 **Budget Travel Tips**
- Learn basic Arabic/French phrases for better prices
- Eat where locals eat for authentic experiences
- Walk everywhere in the medina (it's free!)
- Join other travelers for shared costs
- Bargain respectfully in souks
- Drink mint tea - it's offered everywhere!

This budget adventure gives you an authentic, immersive experience in one of the world's most fascinating medieval cities, all while keeping costs minimal!`
            }
          },
          {
            type: 'accommodation_recommendations',
            payload: {
              recommendations: [
                {
                  name: "Riad Layla Ruby",
                  type: "Budget Riad",
                  description: "Charming traditional riad in the heart of Fez Medina with authentic Moroccan atmosphere",
                  key_features: ["Central medina location", "Traditional architecture", "Rooftop terrace", "Free WiFi", "Breakfast included"],
                  price_per_night: "$25-35",
                  total_cost: "$175-245 for 7 nights",
                  booking_link: "https://riadlayla.com",
                  special_offers: "Free walking tour for guests staying 3+ nights",
                  why_good_value: "Authentic experience at unbeatable prices in prime location",
                  location_score: "9/10 - Walking distance to all major attractions"
                },
                {
                  name: "Hostel Atlas Fez",
                  type: "Backpacker Hostel",
                  description: "Clean, modern hostel with shared facilities perfect for solo travelers and backpackers",
                  key_features: ["Shared dormitories", "Common kitchen", "Social areas", "WiFi", "Lockers"],
                  price_per_night: "$15-20",
                  total_cost: "$105-140 for 7 nights",
                  booking_link: "https://hostelatlas.com",
                  special_offers: "Discount for week-long stays",
                  why_good_value: "Rock-bottom prices with modern amenities and social atmosphere",
                  location_score: "8/10 - Easy access to medina and new city"
                }
              ],
              destination: "Fez",
              budget_per_night: "$25-35",
              accommodation_type: "Budget Riad",
              check_in: "2025-12-15",
              check_out: "2025-12-22"
            }
          },
          {
            type: 'food_recommendations',
            payload: {
              recommendations: [
                {
                  name: "Spicy Merguez Tagine",
                  description: "Fiery Moroccan sausage tagine with hot peppers and bold spices for heat lovers",
                  flavor_profile: "Intensely spicy with complex heat layers, bold and robust flavors",
                  key_ingredients: ["Merguez sausage", "Hot peppers", "Harissa", "Onions", "Bold spices"],
                  cultural_significance: "Traditional worker's meal, hearty and filling for active lifestyles",
                  recipe_link: "#",
                  why_matches: "Perfect for your high spice tolerance and adventurous palate"
                },
                {
                  name: "Street-Style Harira",
                  description: "Authentic tomato-based soup with lentils, chickpeas, and warming spices",
                  flavor_profile: "Rich, warming, and satisfying with authentic street food character",
                  key_ingredients: ["Tomatoes", "Lentils", "Chickpeas", "Fresh herbs", "Moroccan spices"],
                  cultural_significance: "Traditional Ramadan breaking fast meal, beloved street food",
                  recipe_link: "#",
                  why_matches: "Authentic street food experience within your budget range"
                }
              ],
              taste_preferences: "Hot and spicy, authentic flavors",
              cuisine_type: "Moroccan Traditional",
              dietary_restrictions: "None specified"
            }
          }
        ]
      }
    },
    {
      name: "Coastal Casablanca Business Trip",
      description: "Modern business-focused stay in Casablanca with international cuisine and efficiency",
      formValues: {
        destination: "Casablanca",
        passengers: "2",
        class_preference: "business",
        guests: "2",
        hotel_preference: "modern",
        budget_range: "mid-range",
        amenities: ["WiFi", "Gym", "Restaurant", "Room Service"],
        cuisine_preferences: ["International", "Mediterranean"],
        spice_tolerance: "mild",
        food_budget: "mid-range",
        activity_types: ["Museums", "Beach Activities"],
        cultural_interests: ["Architecture", "Art & Crafts"],
        physical_level: "low",
        budget: "$4000-6000",
        package_type: "partial",
        seasonal_preferences: "summer"
      },
      response: {
        messages: [
          {
            type: 'text',
            payload: {
              content: `# 🏢 Modern Casablanca Business Experience

Welcome to Morocco's economic capital! Your professional stay in Casablanca combines modern business efficiency with coastal charm and international sophistication.

## ✈️ **Business Class Convenience**
**Direct Business Flights**
- **Royal Air Maroc**: Direct flights to Mohammed V Airport
- **Air France**: European connections with business comfort
- **Emirates**: Premium service via Dubai
- **Benefits**: Priority check-in, lounge access, extra baggage
- **Estimated cost**: $2,000 per person

## 🏨 **Modern Business Hotel: Four Seasons Casablanca**
**International Luxury on the Atlantic**
- **Location**: Corniche waterfront with ocean views
- **Room Type**: Ocean View Business Suite
- **Business Amenities**: 
  - 24/7 business center
  - High-speed WiFi throughout
  - Executive lounge access
  - Modern fitness center
  - Multiple international restaurants
- **Cost**: $350/night (4 nights = $1,400)

## 🍽️ **International Dining Experience**
**Modern Restaurant Selection:**
- **Le Cabestan**: French-Mediterranean cuisine with ocean views
- **Brasserie La Tour**: International business dining
- **SkyBar**: Rooftop dining with city panoramas
- **Hotel restaurants**: Convenient in-house options for busy schedules

**Daily Food Budget**: $80/day for international cuisine

## 🎯 **Efficient Cultural & Business Activities**

### Day 1: Arrival & Business Setup
- **Morning**: Airport pickup and hotel check-in
- **Afternoon**: Business center setup, meetings if needed
- **Evening**: Welcome dinner at Le Cabestan

### Day 2: Hassan II Mosque & Modern Casablanca
- **Morning**: Guided tour of Hassan II Mosque (architectural marvel)
- **Afternoon**: Business district exploration, Morocco Mall
- **Evening**: Networking dinner at international restaurant

### Day 3: Coastal Activities & Art
- **Morning**: Beach time at Ain Diab or hotel pool
- **Afternoon**: Villa des Arts contemporary art museum
- **Evening**: Sunset drinks at Sky Bar

### Day 4: Final Business & Departure
- **Morning**: Final meetings or leisure time
- **Afternoon**: Departure preparations
- **Evening**: Airport transfer for evening flights

## 🌊 **Modern Coastal Experiences**
- **Corniche waterfront**: Modern promenade perfect for walks
- **Morocco Mall**: International shopping and entertainment
- **Hassan II Mosque**: World's 3rd largest mosque with ocean setting
- **Art Deco architecture**: Colonial heritage in downtown area
- **Modern beaches**: Ain Diab resort area

## 💼 **Business Conveniences**
- 24/7 business center access
- High-speed internet in all areas
- Executive car service available
- International cuisine for familiar tastes
- English-speaking concierge services
- Modern conference facilities if needed

## 💰 **Investment Summary**
- **Flights**: $4,000 (2 x $2,000 business class)
- **Accommodation**: $1,400 (4 nights modern luxury)
- **Food & Dining**: $640 (4 days international cuisine)
- **Activities & Tours**: $300
- **Transportation**: $200
- **Total Estimated**: $6,540

## 🎯 **Business Travel Benefits**
- **Time efficiency**: Modern infrastructure and services
- **International standards**: Familiar business environment
- **Coastal relaxation**: Ocean views for stress relief
- **Cultural touch**: Authentic Morocco without overwhelm
- **Professional networking**: International business community

This Casablanca experience perfectly balances business efficiency with cultural discovery, offering you the best of modern Morocco's commercial capital with the convenience and standards you expect for professional travel.`
            }
          },
          {
            type: 'accommodation_recommendations',
            payload: {
              recommendations: [
                {
                  name: "Four Seasons Hotel Casablanca",
                  type: "Modern Business Hotel",
                  description: "Luxury beachfront hotel with world-class business facilities and international standards",
                  key_features: ["Ocean views", "Business center", "Executive lounge", "Spa and fitness", "Multiple restaurants"],
                  price_per_night: "$350-500",
                  total_cost: "$1400-2000 for 4 nights",
                  booking_link: "https://fourseasons.com/casablanca",
                  special_offers: "Business traveler package with airport transfers",
                  why_good_value: "International luxury standards with prime oceanfront location",
                  location_score: "9/10 - Corniche waterfront, close to business district"
                },
                {
                  name: "Hyatt Regency Casablanca",
                  type: "Business Hotel",
                  description: "Modern hotel in business district with excellent meeting facilities and professional services",
                  key_features: ["Business district location", "Conference facilities", "Fitness center", "International dining", "Executive floors"],
                  price_per_night: "$200-300",
                  total_cost: "$800-1200 for 4 nights",
                  booking_link: "https://hyatt.com",
                  special_offers: "Extended stay benefits for 4+ nights",
                  why_good_value: "Professional environment with excellent business services",
                  location_score: "8.5/10 - Heart of business district"
                }
              ],
              destination: "Casablanca",
              budget_per_night: "$350-500",
              accommodation_type: "Modern Business Hotel",
              check_in: "2025-07-20",
              check_out: "2025-07-24"
            }
          },
          {
            type: 'food_recommendations',
            payload: {
              recommendations: [
                {
                  name: "Mediterranean Sea Bass",
                  description: "Fresh Atlantic sea bass with Mediterranean herbs and light seasoning",
                  flavor_profile: "Light, fresh, and mild with subtle herb flavors and ocean essence",
                  key_ingredients: ["Fresh sea bass", "Mediterranean herbs", "Olive oil", "Lemon", "Light seasoning"],
                  cultural_significance: "Reflects Casablanca's coastal location and international dining scene",
                  recipe_link: "#",
                  why_matches: "Perfect for your mild spice preference and international cuisine taste"
                },
                {
                  name: "International Business Lunch",
                  description: "Professional dining experience with familiar international flavors and presentation",
                  flavor_profile: "Mild, sophisticated, and internationally familiar with quality ingredients",
                  key_ingredients: ["Premium ingredients", "International preparation", "Professional presentation", "Mild seasonings"],
                  cultural_significance: "Represents modern Morocco's integration with international business culture",
                  recipe_link: "#",
                  why_matches: "Ideal for business dining with familiar, mild flavors"
                }
              ],
              taste_preferences: "Mild flavors, international cuisine",
              cuisine_type: "International",
              dietary_restrictions: "None specified"
            }
          }
        ]
      }
    }
  ];

  /**
   * Check if demo mode is enabled
   */
  isDemoMode(): boolean {
    return import.meta.env.VITE_DEMO_MODE === 'true';
  }

  /**
   * Generate demo response based on form data
   */
  generateDemoResponse(formData: any): ApiResponse {
    console.log('Demo mode: Analyzing form data for best matching scenario...', formData);
    
    // Calculate match scores for each scenario
    const scenarioScores = this.demoScenarios.map(scenario => ({
      scenario,
      score: this.calculateMatchScore(formData, scenario.formValues)
    }));

    // Sort by score and get the best match
    scenarioScores.sort((a, b) => b.score - a.score);
    const bestMatch = scenarioScores[0];

    console.log('Demo mode: Best matching scenario:', bestMatch.scenario.name, 'Score:', bestMatch.score);

    // Add a personalized intro message
    const introMessage = {
      type: 'text' as const,
      payload: {
        content: `**Research** 

I've analyzed your travel preferences! Here's your comprehensive Morocco travel plan:`
      }
    };

    // Return the scenario response with intro
    return {
      messages: [introMessage, ...bestMatch.scenario.response.messages]
    };
  }

  /**
   * Calculate how well form data matches a scenario
   */
  private calculateMatchScore(formData: any, scenarioValues: Partial<DemoFormData>): number {
    let score = 0;
    let totalFields = 0;

    // Check each field in scenario values
    for (const [key, scenarioValue] of Object.entries(scenarioValues)) {
      totalFields++;
      const formValue = formData[key];

      if (formValue === undefined || formValue === '' || 
          (Array.isArray(formValue) && formValue.length === 0)) {
        // Field not filled in form, neutral score
        continue;
      }

      if (Array.isArray(scenarioValue) && Array.isArray(formValue)) {
        // Array comparison (for checkboxes)
        const intersection = scenarioValue.filter(value => formValue.includes(value));
        const union = [...new Set([...scenarioValue, ...formValue])];
        score += intersection.length / union.length;
      } else if (typeof scenarioValue === 'boolean' && typeof formValue === 'boolean') {
        // Boolean comparison
        score += scenarioValue === formValue ? 1 : 0;
      } else {
        // String comparison
        const scenarioStr = String(scenarioValue).toLowerCase();
        const formStr = String(formValue).toLowerCase();
        if (scenarioStr === formStr) {
          score += 1;
        } else if (scenarioStr.includes(formStr) || formStr.includes(scenarioStr)) {
          score += 0.5;
        }
      }
    }

    return totalFields > 0 ? score / totalFields : 0;
  }

  /**
   * Get all demo scenarios for documentation/debugging
   */
  getDemoScenarios(): Array<{name: string, description: string, formValues: Partial<DemoFormData>}> {
    return this.demoScenarios.map(scenario => ({
      name: scenario.name,
      description: scenario.description,
      formValues: scenario.formValues
    }));
  }

  /**
   * Get recommended form values for a specific demo scenario
   */
  getScenarioFormValues(scenarioName: string): Partial<DemoFormData> | null {
    const scenario = this.demoScenarios.find(s => s.name === scenarioName);
    return scenario ? scenario.formValues : null;
  }
}

export const demoService = new DemoService();

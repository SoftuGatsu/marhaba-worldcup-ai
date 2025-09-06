# 🎭 Demo Mode Guide

This document explains how to use the demo mode feature and provides the recommended form values for each demo scenario.

## 🔧 Enabling Demo Mode

To enable demo mode, set the environment variable:
```
VITE_DEMO_MODE=true
```

When demo mode is enabled:
- All responses will be generated from predefined demo scenarios
- The system will analyze form data to match the best scenario
- Responses are immediate and don't require external services
- Perfect for demonstrations, testing, and development

## 📋 Demo Scenarios

### 1. 🏰 Luxury Marrakech Experience

**Description**: High-end family trip to Marrakech with cultural interests and fine dining

**Recommended Form Values**:
```
General Information:
- Destination: "Marrakech"
- Budget: "$8000-12000"

Flight Information:
- Passengers: "4"
- Class Preference: "Business"

Accommodation:
- Guests: "4" 
- Hotel Preference: "Luxury Hotel"
- Budget Range: "$200-400" or "$400+"
- Amenities: ✓ WiFi, ✓ Pool, ✓ Spa, ✓ Restaurant

Food & Dining:
- Cuisine Preferences: ✓ Moroccan Traditional, ✓ Fine Dining
- Spice Tolerance: "Medium - Some spice"
- Food Budget: "$80-150" or "$150+"

Activities & Experiences:
- Activity Types: ✓ Historical Sites, ✓ Museums, ✓ Cultural Shows, ✓ Cooking Classes
- Cultural Interests: ✓ Architecture, ✓ Art & Crafts, ✓ History
- Physical Activity Level: "Moderate - Some walking/hiking"

Travel Booking:
- Package Type: "Full Package (Flight + Hotel + Activities)"

Weather Considerations:
- Seasonal Preferences: "Spring (March-May)"
```

**Expected Response**: Luxury 4-day Marrakech itinerary with La Mamounia hotel, premium dining, cultural activities, and total budget around $18,000.

---

### 2. 🎒 Budget Adventure Fez Trip

**Description**: Affordable solo backpacker experience in Fez with cultural exploration

**Recommended Form Values**:
```
General Information:
- Destination: "Fez"
- Budget: "$1500-2000"

Flight Information:
- Passengers: "1"
- Class Preference: "Economy"

Accommodation:
- Guests: "1"
- Hotel Preference: "Budget Friendly"
- Budget Range: "$50-100"
- Amenities: ✓ WiFi (only)

Food & Dining:
- Cuisine Preferences: ✓ Moroccan Traditional, ✓ Street Food
- Spice Tolerance: "Hot - Love spicy food"
- Food Budget: "$20-40"

Activities & Experiences:
- Activity Types: ✓ Historical Sites, ✓ Souks/Markets, ✓ Cultural Shows
- Cultural Interests: ✓ Architecture, ✓ History, ✓ Local Traditions
- Physical Activity Level: "High - Lots of walking/hiking"

Travel Booking:
- Package Type: "Individual Bookings"

Weather Considerations:
- Seasonal Preferences: "Winter (December-February)"
```

**Expected Response**: Budget 7-day Fez adventure with riad accommodation, street food experiences, free cultural activities, and total budget around $1,200.

---

### 3. 🏢 Coastal Casablanca Business Trip

**Description**: Modern business-focused stay in Casablanca with international cuisine and efficiency

**Recommended Form Values**:
```
General Information:
- Destination: "Casablanca"
- Budget: "$4000-6000"

Flight Information:
- Passengers: "2"
- Class Preference: "Business"

Accommodation:
- Guests: "2"
- Hotel Preference: "Modern Hotel"
- Budget Range: "$100-200"
- Amenities: ✓ WiFi, ✓ Gym, ✓ Restaurant, ✓ Room Service

Food & Dining:
- Cuisine Preferences: ✓ International, ✓ Mediterranean
- Spice Tolerance: "Mild - No spice"
- Food Budget: "$40-80"

Activities & Experiences:
- Activity Types: ✓ Museums, ✓ Beach Activities
- Cultural Interests: ✓ Architecture, ✓ Art & Crafts
- Physical Activity Level: "Low - Minimal walking"

Travel Booking:
- Package Type: "Partial Package (Select components)"

Weather Considerations:
- Seasonal Preferences: "Summer (June-August)"
```

**Expected Response**: Modern 4-day Casablanca business trip with Four Seasons hotel, international dining, efficient activities, and total budget around $6,540.

## 🎯 How to Test Demo Scenarios

1. **Enable Demo Mode**: Set `VITE_DEMO_MODE=true` in your `.env` file
2. **Fill the Form**: Use the recommended values above for your desired scenario
3. **Submit**: The system will automatically match your inputs to the best scenario
4. **Review Response**: You'll get a comprehensive, detailed response for that scenario

## 🔄 Scenario Matching Algorithm

The demo service uses a scoring algorithm that:
- Compares form values with predefined scenario values
- Handles different field types (strings, arrays, booleans)
- Calculates similarity scores for each scenario
- Returns the best matching scenario's response
- Adds a demo mode indicator to the response

## 🛠️ For Developers

### Adding New Demo Scenarios

To add a new demo scenario, edit `/src/services/demoService.ts`:

```typescript
{
  name: "Your Scenario Name",
  description: "Brief description of the scenario",
  formValues: {
    // Form field values that should trigger this scenario
    destination: "City Name",
    budget: "$X-Y",
    // ... other form fields
  },
  response: {
    messages: [
      {
        type: 'text',
        payload: {
          content: 'Your comprehensive response markdown content...'
        }
      },
      // Optional: Add structured recommendations
      {
        type: 'accommodation_recommendations',
        payload: { /* accommodation data */ }
      },
      {
        type: 'food_recommendations', 
        payload: { /* food data */ }
      }
    ]
  }
}
```

### Demo Mode Detection

Check if demo mode is active:
```typescript
import { demoService } from '@/services/demoService';

if (demoService.isDemoMode()) {
  // Demo mode logic
}
```

### Getting Demo Scenarios

Retrieve all available scenarios:
```typescript
const scenarios = demoService.getDemoScenarios();
console.log('Available demo scenarios:', scenarios);
```

## 📝 Notes

- Demo responses are designed to be comprehensive and realistic
- Each scenario includes multiple message types (text, accommodations, food)
- Responses simulate real API delays (2 seconds)
- Form data is analyzed to find the best matching scenario
- If no good match is found, the system defaults to the highest-scoring scenario

## 🚀 Demo Presentation Tips

1. **Start with Form**: Show how different form combinations trigger different scenarios
2. **Highlight Matching**: Explain how the system matches preferences to scenarios  
3. **Compare Scenarios**: Demonstrate the range from budget to luxury options
4. **Show Completeness**: Point out how responses include accommodations, food, activities, etc.
5. **Emphasize Realism**: Note how responses include realistic pricing and detailed itineraries

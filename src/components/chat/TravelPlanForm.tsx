import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CalendarIcon, Plane, Hotel, Utensils, MapPin, CloudSun, Search, CreditCard, UtensilsCrossed } from 'lucide-react';

interface TravelPlanFormProps {
  onSubmit: (formData: any) => void;
  onBack?: () => void;
  disabled?: boolean;
}

export const TravelPlanForm: React.FC<TravelPlanFormProps> = ({ onSubmit, onBack, disabled }) => {
  const [formData, setFormData] = useState({
    // Flight Agent
    departure_city: '',
    departure_date: '',
    return_date: '',
    passengers: '1',
    class_preference: '',
    airline_preference: '',
    flexible_dates: false,
    
    // Hotel Agent
    check_in_date: '',
    check_out_date: '',
    guests: '1',
    room_type: '',
    hotel_preference: '',
    amenities: [] as string[],
    budget_range: '',
    
    // Food Recommender Agent
    dietary_restrictions: [] as string[],
    cuisine_preferences: [] as string[],
    meal_types: [] as string[],
    food_budget: '',
    spice_tolerance: '',
    
    // Restaurant Agent
    restaurant_type: '',
    dining_occasion: '',
    group_size: '2',
    location_preference: '',
    restaurant_budget: '',
    
    // Activities Agent
    activity_types: [] as string[],
    age_group: '',
    physical_level: '',
    duration_preference: '',
    indoor_outdoor: '',
    cultural_interests: [] as string[],
    
    // Weather Agent
    weather_concerns: [] as string[],
    seasonal_preferences: '',
    activities_weather_dependent: false,
    
    // Research Agent
    research_topics: [] as string[],
    information_depth: '',
    specific_questions: '',
    
    // Travel Booking Agent
    package_type: '',
    booking_timeline: '',
    special_requirements: '',
    contact_preferences: [] as string[],
    
    // General
    destination: '',
    travel_dates: '',
    budget: '',
    special_notes: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a comprehensive prompt for the agents
    const prompt = generateAgentPrompt(formData);
    console.log('Form submitted with prompt:', prompt);
    console.log('Form data:', formData);
    onSubmit({ message: prompt, formData });
  };

  const generateAgentPrompt = (data: any) => {
    let prompt = `I'm planning a trip to ${data.destination || 'Morocco'} and need comprehensive assistance. Here are my requirements:\n\n`;
    
    // Flight information - check for any flight-related field
    const hasFlightInfo = data.departure_city || data.departure_date || data.return_date || 
                         data.passengers !== '1' || data.class_preference || data.airline_preference || data.flexible_dates;
    
    if (hasFlightInfo) {
      prompt += `🛫 FLIGHT REQUIREMENTS:\n`;
      if (data.departure_city) prompt += `- Departing from: ${data.departure_city}\n`;
      if (data.departure_date) prompt += `- Departure date: ${data.departure_date}\n`;
      if (data.return_date) prompt += `- Return date: ${data.return_date}\n`;
      if (data.passengers !== '1') prompt += `- Passengers: ${data.passengers}\n`;
      if (data.class_preference) prompt += `- Class preference: ${data.class_preference}\n`;
      if (data.airline_preference) prompt += `- Airline preference: ${data.airline_preference}\n`;
      if (data.flexible_dates) prompt += `- I have flexible dates\n`;
      prompt += `\n`;
    }
    
    // Hotel information - check for any accommodation-related field
    const hasAccommodationInfo = data.check_in_date || data.check_out_date || data.guests !== '1' || 
                               data.room_type || data.hotel_preference || data.amenities.length > 0 || data.budget_range;
    
    if (hasAccommodationInfo) {
      prompt += `🏨 ACCOMMODATION REQUIREMENTS:\n`;
      if (data.check_in_date) prompt += `- Check-in: ${data.check_in_date}\n`;
      if (data.check_out_date) prompt += `- Check-out: ${data.check_out_date}\n`;
      if (data.guests !== '1') prompt += `- Guests: ${data.guests}\n`;
      if (data.room_type) prompt += `- Room type: ${data.room_type}\n`;
      if (data.hotel_preference) prompt += `- Hotel preference: ${data.hotel_preference}\n`;
      if (data.amenities.length > 0) prompt += `- Required amenities: ${data.amenities.join(', ')}\n`;
      if (data.budget_range) prompt += `- Budget range: ${data.budget_range}\n`;
      prompt += `\n`;
    }
    
    // Food and dining - check for any food-related field
    const hasFoodInfo = data.dietary_restrictions.length > 0 || data.cuisine_preferences.length > 0 || 
                       data.meal_types.length > 0 || data.food_budget || data.spice_tolerance ||
                       data.restaurant_type || data.dining_occasion || data.group_size !== '2' || 
                       data.location_preference || data.restaurant_budget;
    
    if (hasFoodInfo) {
      prompt += `🍽️ FOOD & DINING PREFERENCES:\n`;
      if (data.dietary_restrictions.length > 0) prompt += `- Dietary restrictions: ${data.dietary_restrictions.join(', ')}\n`;
      if (data.cuisine_preferences.length > 0) prompt += `- Cuisine preferences: ${data.cuisine_preferences.join(', ')}\n`;
      if (data.meal_types.length > 0) prompt += `- Meal types interested in: ${data.meal_types.join(', ')}\n`;
      if (data.food_budget) prompt += `- Food budget: ${data.food_budget}\n`;
      if (data.spice_tolerance) prompt += `- Spice tolerance: ${data.spice_tolerance}\n`;
      
      if (data.restaurant_type || data.dining_occasion) {
        prompt += `- Restaurant preferences:\n`;
        if (data.restaurant_type) prompt += `  • Type: ${data.restaurant_type}\n`;
        if (data.dining_occasion) prompt += `  • Occasion: ${data.dining_occasion}\n`;
        if (data.group_size !== '2') prompt += `  • Group size: ${data.group_size}\n`;
        if (data.location_preference) prompt += `  • Location: ${data.location_preference}\n`;
        if (data.restaurant_budget) prompt += `  • Budget: ${data.restaurant_budget}\n`;
      }
      prompt += `\n`;
    }
    
    // Activities - check for any activity-related field
    const hasActivityInfo = data.activity_types.length > 0 || data.cultural_interests.length > 0 || 
                           data.age_group || data.physical_level || data.duration_preference || data.indoor_outdoor;
    
    if (hasActivityInfo) {
      prompt += `🎯 ACTIVITIES & EXPERIENCES:\n`;
      if (data.activity_types.length > 0) prompt += `- Activity types: ${data.activity_types.join(', ')}\n`;
      if (data.age_group) prompt += `- Age group: ${data.age_group}\n`;
      if (data.physical_level) prompt += `- Physical activity level: ${data.physical_level}\n`;
      if (data.duration_preference) prompt += `- Activity duration preference: ${data.duration_preference}\n`;
      if (data.indoor_outdoor) prompt += `- Indoor/Outdoor preference: ${data.indoor_outdoor}\n`;
      if (data.cultural_interests.length > 0) prompt += `- Cultural interests: ${data.cultural_interests.join(', ')}\n`;
      prompt += `\n`;
    }
    
    // Weather considerations - check for any weather-related field
    const hasWeatherInfo = data.weather_concerns.length > 0 || data.seasonal_preferences || data.activities_weather_dependent;
    
    if (hasWeatherInfo) {
      prompt += `🌤️ WEATHER CONSIDERATIONS:\n`;
      if (data.weather_concerns.length > 0) prompt += `- Weather concerns: ${data.weather_concerns.join(', ')}\n`;
      if (data.seasonal_preferences) prompt += `- Seasonal preferences: ${data.seasonal_preferences}\n`;
      if (data.activities_weather_dependent) prompt += `- My activities are weather dependent\n`;
      prompt += `\n`;
    }
    
    // Research topics - check for any research-related field
    const hasResearchInfo = data.research_topics.length > 0 || data.specific_questions || data.information_depth;
    
    if (hasResearchInfo) {
      prompt += `📚 RESEARCH & INFORMATION NEEDS:\n`;
      if (data.research_topics.length > 0) prompt += `- Research topics: ${data.research_topics.join(', ')}\n`;
      if (data.information_depth) prompt += `- Information depth needed: ${data.information_depth}\n`;
      if (data.specific_questions) prompt += `- Specific questions: ${data.specific_questions}\n`;
      prompt += `\n`;
    }
    
    // Booking requirements - check for any booking-related field
    const hasBookingInfo = data.package_type || data.booking_timeline || data.special_requirements || data.contact_preferences.length > 0;
    
    if (hasBookingInfo) {
      prompt += `📋 BOOKING REQUIREMENTS:\n`;
      if (data.package_type) prompt += `- Package type: ${data.package_type}\n`;
      if (data.booking_timeline) prompt += `- Booking timeline: ${data.booking_timeline}\n`;
      if (data.special_requirements) prompt += `- Special requirements: ${data.special_requirements}\n`;
      if (data.contact_preferences.length > 0) prompt += `- Contact preferences: ${data.contact_preferences.join(', ')}\n`;
      prompt += `\n`;
    }
    
    // General information - check for any general field
    const hasGeneralInfo = data.budget || data.special_notes || data.destination;
    
    if (hasGeneralInfo) {
      prompt += `💰 GENERAL INFORMATION:\n`;
      if (data.destination) prompt += `- Destination: ${data.destination}\n`;
      if (data.budget) prompt += `- Overall budget: ${data.budget}\n`;
      if (data.special_notes) prompt += `- Special notes: ${data.special_notes}\n`;
    }
    
    // Ensure we always have a meaningful prompt
    if (!hasFlightInfo && !hasAccommodationInfo && !hasFoodInfo && !hasActivityInfo && !hasWeatherInfo && !hasResearchInfo && !hasBookingInfo && !hasGeneralInfo) {
      prompt += `Please help me plan a comprehensive trip to Morocco. I'm looking for recommendations on flights, accommodation, food, activities, and general travel advice.\n`;
    }
    
    console.log('Generated prompt:', prompt);
    console.log('Prompt length:', prompt.length);
    return prompt;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Plan Your Morocco Adventure</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Chat
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Trip Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              General Trip Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destination">Destination in Morocco</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Marrakech, Casablanca, Fez..."
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="budget">Overall Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $2000-3000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="special_notes">Special Notes or Requirements</Label>
              <Textarea
                id="special_notes"
                placeholder="Any special requirements, preferences, or notes..."
                value={formData.special_notes}
                onChange={(e) => handleInputChange('special_notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Flight Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Flight Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departure_city">Departure City</Label>
                <Input
                  id="departure_city"
                  placeholder="e.g., New York, London..."
                  value={formData.departure_city}
                  onChange={(e) => handleInputChange('departure_city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="departure_date">Departure Date</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => handleInputChange('departure_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="return_date">Return Date</Label>
                <Input
                  id="return_date"
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => handleInputChange('return_date', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Select value={formData.passengers} onValueChange={(value) => handleInputChange('passengers', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} passenger{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="class_preference">Class Preference</Label>
                <Select value={formData.class_preference} onValueChange={(value) => handleInputChange('class_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="airline_preference">Airline Preference</Label>
                <Input
                  id="airline_preference"
                  placeholder="e.g., Royal Air Maroc, Emirates..."
                  value={formData.airline_preference}
                  onChange={(e) => handleInputChange('airline_preference', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flexible_dates"
                checked={formData.flexible_dates}
                onCheckedChange={(checked) => handleInputChange('flexible_dates', checked)}
              />
              <Label htmlFor="flexible_dates">I have flexible travel dates (+/- 3 days)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Accommodation Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="check_in_date">Check-in Date</Label>
                <Input
                  id="check_in_date"
                  type="date"
                  value={formData.check_in_date}
                  onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="check_out_date">Check-out Date</Label>
                <Input
                  id="check_out_date"
                  type="date"
                  value={formData.check_out_date}
                  onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} guest{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room_type">Room Type</Label>
                <Select value={formData.room_type} onValueChange={(value) => handleInputChange('room_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="double">Double Room</SelectItem>
                    <SelectItem value="twin">Twin Room</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="family">Family Room</SelectItem>
                    <SelectItem value="riad">Traditional Riad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="hotel_preference">Hotel Type Preference</Label>
                <Select value={formData.hotel_preference} onValueChange={(value) => handleInputChange('hotel_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury Hotel</SelectItem>
                    <SelectItem value="boutique">Boutique Hotel</SelectItem>
                    <SelectItem value="traditional">Traditional Riad</SelectItem>
                    <SelectItem value="modern">Modern Hotel</SelectItem>
                    <SelectItem value="budget">Budget Friendly</SelectItem>
                    <SelectItem value="resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Required Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Airport Shuttle', 'Parking'].map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity_${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleArrayChange('amenities', amenity, checked as boolean)}
                    />
                    <Label htmlFor={`amenity_${amenity}`} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="budget_range">Accommodation Budget Range (per night)</Label>
              <Select value={formData.budget_range} onValueChange={(value) => handleInputChange('budget_range', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">$50-100</SelectItem>
                  <SelectItem value="mid-range">$100-200</SelectItem>
                  <SelectItem value="luxury">$200-400</SelectItem>
                  <SelectItem value="ultra-luxury">$400+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Food & Restaurant Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Food & Dining Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Dietary Restrictions</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut Allergies', 'None'].map(diet => (
                  <div key={diet} className="flex items-center space-x-2">
                    <Checkbox
                      id={`diet_${diet}`}
                      checked={formData.dietary_restrictions.includes(diet)}
                      onCheckedChange={(checked) => handleArrayChange('dietary_restrictions', diet, checked as boolean)}
                    />
                    <Label htmlFor={`diet_${diet}`} className="text-sm">{diet}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Cuisine Preferences</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Moroccan Traditional', 'Berber Cuisine', 'Mediterranean', 'French', 'International', 'Street Food', 'Fine Dining', 'Local Specialties'].map(cuisine => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cuisine_${cuisine}`}
                      checked={formData.cuisine_preferences.includes(cuisine)}
                      onCheckedChange={(checked) => handleArrayChange('cuisine_preferences', cuisine, checked as boolean)}
                    />
                    <Label htmlFor={`cuisine_${cuisine}`} className="text-sm">{cuisine}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="spice_tolerance">Spice Tolerance</Label>
                <Select value={formData.spice_tolerance} onValueChange={(value) => handleInputChange('spice_tolerance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spice level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild - No spice</SelectItem>
                    <SelectItem value="medium">Medium - Some spice</SelectItem>
                    <SelectItem value="hot">Hot - Love spicy food</SelectItem>
                    <SelectItem value="very-hot">Very Hot - Bring the heat!</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="food_budget">Food Budget (per day)</Label>
                <Select value={formData.food_budget} onValueChange={(value) => handleInputChange('food_budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">$20-40</SelectItem>
                    <SelectItem value="mid-range">$40-80</SelectItem>
                    <SelectItem value="luxury">$80-150</SelectItem>
                    <SelectItem value="fine-dining">$150+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="restaurant_type">Restaurant Type Preference</Label>
                <Select value={formData.restaurant_type} onValueChange={(value) => handleInputChange('restaurant_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">Traditional Moroccan</SelectItem>
                    <SelectItem value="modern">Modern Fusion</SelectItem>
                    <SelectItem value="rooftop">Rooftop Dining</SelectItem>
                    <SelectItem value="street-food">Street Food</SelectItem>
                    <SelectItem value="fine-dining">Fine Dining</SelectItem>
                    <SelectItem value="casual">Casual Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Activities & Experiences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Activity Types of Interest</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Historical Sites', 'Museums', 'Souks/Markets', 'Desert Tours', 'Mountain Hiking', 'Beach Activities', 'Cultural Shows', 'Cooking Classes', 'Adventure Sports', 'Photography Tours', 'Camel Riding', 'Hot Air Balloon'].map(activity => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`activity_${activity}`}
                      checked={formData.activity_types.includes(activity)}
                      onCheckedChange={(checked) => handleArrayChange('activity_types', activity, checked as boolean)}
                    />
                    <Label htmlFor={`activity_${activity}`} className="text-sm">{activity}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="physical_level">Physical Activity Level</Label>
                <Select value={formData.physical_level} onValueChange={(value) => handleInputChange('physical_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minimal walking</SelectItem>
                    <SelectItem value="moderate">Moderate - Some walking/hiking</SelectItem>
                    <SelectItem value="high">High - Lots of walking/hiking</SelectItem>
                    <SelectItem value="extreme">Extreme - Adventure sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration_preference">Activity Duration Preference</Label>
                <Select value={formData.duration_preference} onValueChange={(value) => handleInputChange('duration_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 hours)</SelectItem>
                    <SelectItem value="half-day">Half Day (3-4 hours)</SelectItem>
                    <SelectItem value="full-day">Full Day (6-8 hours)</SelectItem>
                    <SelectItem value="multi-day">Multi-day Tours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Cultural Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Architecture', 'Art & Crafts', 'Music & Dance', 'Religious Sites', 'Local Traditions', 'History', 'Literature', 'Language Learning'].map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cultural_${interest}`}
                      checked={formData.cultural_interests.includes(interest)}
                      onCheckedChange={(checked) => handleArrayChange('cultural_interests', interest, checked as boolean)}
                    />
                    <Label htmlFor={`cultural_${interest}`} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="w-5 h-5" />
              Weather Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Weather Concerns</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Extreme Heat', 'Rain', 'Wind', 'Cold Nights', 'Humidity', 'Dust Storms', 'Seasonal Crowds'].map(concern => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weather_${concern}`}
                      checked={formData.weather_concerns.includes(concern)}
                      onCheckedChange={(checked) => handleArrayChange('weather_concerns', concern, checked as boolean)}
                    />
                    <Label htmlFor={`weather_${concern}`} className="text-sm">{concern}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seasonal_preferences">Seasonal Preferences</Label>
                <Select value={formData.seasonal_preferences} onValueChange={(value) => handleInputChange('seasonal_preferences', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring (March-May)</SelectItem>
                    <SelectItem value="summer">Summer (June-August)</SelectItem>
                    <SelectItem value="autumn">Autumn (September-November)</SelectItem>
                    <SelectItem value="winter">Winter (December-February)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="activities_weather_dependent"
                  checked={formData.activities_weather_dependent}
                  onCheckedChange={(checked) => handleInputChange('activities_weather_dependent', checked)}
                />
                <Label htmlFor="activities_weather_dependent">My planned activities are weather dependent</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Research & Information Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Research Topics</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Local Customs', 'Language Basics', 'Currency & Tipping', 'Transportation', 'Safety Tips', 'Cultural Etiquette', 'Shopping Tips', 'Emergency Info'].map(topic => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={`research_${topic}`}
                      checked={formData.research_topics.includes(topic)}
                      onCheckedChange={(checked) => handleArrayChange('research_topics', topic, checked as boolean)}
                    />
                    <Label htmlFor={`research_${topic}`} className="text-sm">{topic}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="information_depth">Information Depth Needed</Label>
              <Select value={formData.information_depth} onValueChange={(value) => handleInputChange('information_depth', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Overview</SelectItem>
                  <SelectItem value="detailed">Detailed Information</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Guide</SelectItem>
                  <SelectItem value="expert">Expert-level Details</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specific_questions">Specific Questions or Topics</Label>
              <Textarea
                id="specific_questions"
                placeholder="Any specific questions about Morocco, culture, travel tips, etc."
                value={formData.specific_questions}
                onChange={(e) => handleInputChange('specific_questions', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Travel Booking Agent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Booking & Travel Arrangements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package_type">Package Type Preference</Label>
                <Select value={formData.package_type} onValueChange={(value) => handleInputChange('package_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-package">Full Package (Flight + Hotel + Activities)</SelectItem>
                    <SelectItem value="partial">Partial Package (Select components)</SelectItem>
                    <SelectItem value="individual">Individual Bookings</SelectItem>
                    <SelectItem value="guided-tour">Guided Tour Package</SelectItem>
                    <SelectItem value="self-guided">Self-Guided Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="booking_timeline">Booking Timeline</Label>
                <Select value={formData.booking_timeline} onValueChange={(value) => handleInputChange('booking_timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">As soon as possible</SelectItem>
                    <SelectItem value="1-week">Within 1 week</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="planning">Just planning for now</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Contact Preferences</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Email', 'Phone', 'WhatsApp', 'Text Message'].map(contact => (
                  <div key={contact} className="flex items-center space-x-2">
                    <Checkbox
                      id={`contact_${contact}`}
                      checked={formData.contact_preferences.includes(contact)}
                      onCheckedChange={(checked) => handleArrayChange('contact_preferences', contact, checked as boolean)}
                    />
                    <Label htmlFor={`contact_${contact}`} className="text-sm">{contact}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="special_requirements">Special Requirements or Requests</Label>
              <Textarea
                id="special_requirements"
                placeholder="Any special requirements, accessibility needs, celebration occasions, etc."
                value={formData.special_requirements}
                onChange={(e) => handleInputChange('special_requirements', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-6">
          <Button type="submit" size="lg" className="px-8" disabled={disabled}>
            Create My Morocco Travel Plan
          </Button>
        </div>
      </form>
    </div>
  );
};

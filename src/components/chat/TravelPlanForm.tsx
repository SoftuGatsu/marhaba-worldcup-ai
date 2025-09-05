import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, MapPin, Plane, Clock, DollarSign, Users, Heart, Mountain, Backpack } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TravelFormData {
  source: string;
  destination: string;
  numDays: number[];
  travelTheme: string;
  activityPreferences: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  budget: string;
  flightClass: string;
  visaRequired: boolean;
  travelInsurance: boolean;
  currencyConverter: boolean;
  packingItems: Record<string, boolean>;
  matchInterest: string;
  numberOfTravelers: number;
  maxPricePerNight: number;
  accommodationType: string;
  foodPreferences: string;
}

interface TravelPlanFormProps {
  onSubmit: (formData: TravelFormData) => void;
  disabled?: boolean;
}

const travelThemes = [
  { value: 'football-fan', label: '⚽ Football Fan Experience', icon: Heart },
  { value: 'family-worldcup', label: '👨‍👩‍👧‍👦 Family World Cup Trip', icon: Users },
  { value: 'cultural-football', label: '🕌 Culture & Football Mix', icon: Mountain },
  { value: 'luxury-worldcup', label: '� Luxury World Cup Experience', icon: Backpack },
];

const moroccanCities = [
  { code: "AGD", name: "Agadir", stadium: "Adrar Stadium" },
  { code: "CMN", name: "Casablanca", stadium: "Hassan II Stadium" },
  { code: "FEZ", name: "Fez", stadium: "Fez Stadium" },
  { code: "RAK", name: "Marrakesh", stadium: "Marrakesh Stadium" },
  { code: "RBA", name: "Rabat", stadium: "Prince Moulay Abdellah Stadium" },
  { code: "TNG", name: "Tangier", stadium: "Ibn Batouta Stadium" }
];

const packingItems = {
  '⚽ Football Jerseys & Scarves': true,
  '👕 Comfortable Clothes': true,
  '🩴 Walking Shoes': true,
  '🕶️ Sunglasses & Sunscreen': true,
  '� Phone Charger & Power Bank': true,
  '🎫 Match Tickets & Documents': true,
  '💊 Medications & First-Aid': false,
};

export const TravelPlanForm: React.FC<TravelPlanFormProps> = ({ onSubmit, disabled = false }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: 'CDG', // Example: Paris Charles de Gaulle for international visitors
    destination: 'CMN', // Casablanca as default
    numDays: [7],
    travelTheme: 'football-fan',
    activityPreferences: 'Watching World Cup matches, exploring Moroccan culture, trying local cuisine',
    departureDate: undefined,
    returnDate: undefined,
    budget: 'Standard',
    flightClass: 'Economy',
    visaRequired: false,
    travelInsurance: true,
    currencyConverter: true,
    packingItems: { ...packingItems },
    matchInterest: 'any-matches',
    numberOfTravelers: 2,
    maxPricePerNight: 100,
    accommodationType: 'hotel',
    foodPreferences: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generatePrompt = () => {
    const theme = travelThemes.find(t => t.value === formData.travelTheme)?.label || formData.travelTheme;
    const selectedCity = moroccanCities.find(c => c.code === formData.destination);
    
    return `Plan my ${formData.numDays[0]}-day Morocco 2030 World Cup trip as a ${theme.toLowerCase()} from ${formData.source} to ${selectedCity?.name || formData.destination}.

🇲🇦 MOROCCO WORLD CUP 2030 DETAILS:
- Primary destination: ${selectedCity?.name} (${selectedCity?.stadium})
- Travel dates: ${formData.departureDate ? format(formData.departureDate, 'MMM dd, yyyy') : 'To be determined'} to ${formData.returnDate ? format(formData.returnDate, 'MMM dd, yyyy') : 'To be determined'}
- Number of travelers: ${formData.numberOfTravelers}
- Match interest: ${formData.matchInterest}
- Budget level: ${formData.budget}
- Max price per night per person: $${formData.maxPricePerNight}
- Flight class: ${formData.flightClass}
- Accommodation type: ${formData.accommodationType}
- Food preferences: ${formData.foodPreferences || 'No specific preferences'}

🏆 WORLD CUP PREFERENCES:
- Experience type: ${theme}
- Morocco interests: ${formData.activityPreferences}
- Travel insurance: ${formData.travelInsurance ? 'Required' : 'Not needed'}
- Visa requirements: ${formData.visaRequired ? 'Check required' : 'Not needed'}

Please provide a comprehensive Morocco World Cup 2030 travel plan including:

1. ✈️ FLIGHTS TO MOROCCO:
   - Best flight options from ${formData.source} to Moroccan airports
   - Connections and pricing for World Cup period
   - Tips for World Cup travel logistics

2. 🏟️ WORLD CUP MATCH EXPERIENCE:
   - Stadium information for ${selectedCity?.stadium}
   - Match availability and ticket guidance
   - Transportation to/from stadium
   - Pre/post-match activities in ${selectedCity?.name}

3. 🏨 MOROCCO ACCOMMODATION:
   - ${formData.accommodationType} options within $${formData.maxPricePerNight} per night per person near ${selectedCity?.name}
   - World Cup period availability and pricing
   - Traditional Moroccan accommodation experiences

4. 🗓️ DAILY MOROCCO ITINERARY:
   - Match day schedules
   - Moroccan cultural experiences (medinas, souks, architecture)
   - Food experiences (tagine, couscous, mint tea)
   - Day trips and excursions

5. 🍽️ MOROCCAN CUISINE & RESTAURANTS:
   - Traditional Moroccan restaurants
   - Street food recommendations
   - Halal dining options
   - Local specialties in ${selectedCity?.name}
   - Food preferences consideration: ${formData.foodPreferences || 'General recommendations'}

6. 🚗 MOROCCO TRANSPORTATION:
   - Getting around ${selectedCity?.name}
   - Transportation between World Cup cities
   - Local transport tips and costs

7. 💰 MOROCCO WORLD CUP BUDGET:
   - Complete cost breakdown in Moroccan Dirhams (MAD)
   - World Cup period pricing adjustments
   - Money-saving tips for Morocco

8. 🎯 MOROCCO CULTURAL TIPS:
   - Local customs and etiquette
   - Arabic/French phrases for travelers
   - Shopping in souks and medinas
   - Tipping and bargaining culture
   - Prayer times and cultural sensitivity

Focus on creating an authentic Moroccan World Cup experience that combines football excitement with rich cultural immersion!`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = generatePrompt();
    onSubmit({ ...formData, generatedPrompt: prompt } as any);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🇲🇦 Morocco 2030 World Cup Planner
        </h1>
        <p className="text-muted-foreground text-lg">
          Plan your FIFA World Cup 2030 journey to Morocco! Get personalized recommendations for flights, accommodation, and match experiences.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Destination Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              �🇦 Your Morocco World Cup Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">✈️ Flying from (IATA Code)</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="CDG, LHR, JFK..."
                className="uppercase"
              />
              <p className="text-xs text-muted-foreground">Your departure airport code</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">🏟️ Morocco Host City</Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moroccanCities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name} - {city.stadium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose your primary destination city</p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              ⚽ Plan Your World Cup Adventure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>🕒 Trip Duration: {formData.numDays[0]} days</Label>
              <Slider
                value={formData.numDays}
                onValueChange={(value) => setFormData(prev => ({ ...prev, numDays: value }))}
                max={90}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>3 days</span>
                <span>90 days</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>⚽ Your World Cup Experience</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {travelThemes.map((theme) => (
                  <Button
                    key={theme.value}
                    type="button"
                    variant={formData.travelTheme === theme.value ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, travelTheme: theme.value }))}
                    className="justify-start h-auto p-3"
                  >
                    <theme.icon className="w-4 h-4 mr-2" />
                    {theme.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>🎫 Match Interest</Label>
              <Select value={formData.matchInterest} onValueChange={(value) => setFormData(prev => ({ ...prev, matchInterest: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any-matches">Any available matches</SelectItem>
                  <SelectItem value="group-stage">Group stage matches</SelectItem>
                  <SelectItem value="knockout-stage">Knockout stage matches</SelectItem>
                  <SelectItem value="semifinals-final">Semifinals & Final</SelectItem>
                  <SelectItem value="final-only">Final match only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="numberOfTravelers">👥 Number of Travelers</Label>
              <Input
                id="numberOfTravelers"
                type="number"
                min="1"
                max="20"
                value={formData.numberOfTravelers}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfTravelers: parseInt(e.target.value) || 1 }))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">How many people will be traveling?</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxPricePerNight">💰 Max Price per Night per Person (USD)</Label>
              <Input
                id="maxPricePerNight"
                type="number"
                min="10"
                max="2000"
                step="10"
                value={formData.maxPricePerNight}
                onChange={(e) => setFormData(prev => ({ ...prev, maxPricePerNight: parseInt(e.target.value) || 50 }))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Maximum budget per person per night for accommodation</p>
            </div>

            <div className="space-y-3">
              <Label>🏨 Accommodation Type</Label>
              <Select value={formData.accommodationType} onValueChange={(value) => setFormData(prev => ({ ...prev, accommodationType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hostel">Hostels</SelectItem>
                  <SelectItem value="hotel">Hotels</SelectItem>
                  <SelectItem value="apartment">Apartments</SelectItem>
                  <SelectItem value="riad">Traditional Riads</SelectItem>
                  <SelectItem value="any">Any type</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Preferred type of accommodation</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="foodPreferences">🍽️ Food Preferences</Label>
              <Textarea
                id="foodPreferences"
                value={formData.foodPreferences}
                onChange={(e) => setFormData(prev => ({ ...prev, foodPreferences: e.target.value }))}
                placeholder="e.g., vegetarian, halal, no spicy food, love street food, traditional Moroccan cuisine, dietary restrictions..."
                rows={3}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Any dietary preferences, restrictions, or food interests</p>
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Arrival Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate ? formData.departureDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setFormData(prev => ({ ...prev, departureDate: date }));
                    }}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate ? formData.returnDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setFormData(prev => ({ ...prev, returnDate: date }));
                    }}
                    className="pl-10"
                    min={formData.departureDate ? formData.departureDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activities">�🇦 What interests you about Morocco?</Label>
              <Textarea
                id="activities"
                value={formData.activityPreferences}
                onChange={(e) => setFormData(prev => ({ ...prev, activityPreferences: e.target.value }))}
                placeholder="e.g., watching World Cup matches, exploring Marrakesh medina, trying tagine and couscous, visiting Hassan II Mosque, Atlas Mountains day trip"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Travel Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              � Morocco Travel Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>💰 Budget Level</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Budget">Budget (Hostels & Local Food)</SelectItem>
                  <SelectItem value="Standard">Standard (3-4★ Hotels & Mixed Dining)</SelectItem>
                  <SelectItem value="Luxury">Luxury (5★ Riads & Fine Dining)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>✈️ Flight Class</Label>
              <Select value={formData.flightClass} onValueChange={(value) => setFormData(prev => ({ ...prev, flightClass: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Travel Essentials Section */}
        <Card>
          <CardHeader>
            <CardTitle>🛂 Morocco Travel Essentials & World Cup Packing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Morocco Travel Requirements</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visa"
                    checked={formData.visaRequired}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visaRequired: !!checked }))}
                  />
                  <Label htmlFor="visa">🛃 Check Morocco Visa Requirements</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={formData.travelInsurance}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, travelInsurance: !!checked }))}
                  />
                  <Label htmlFor="insurance">🛡️ Get Travel Insurance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="currency"
                    checked={formData.currencyConverter}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, currencyConverter: !!checked }))}
                  />
                  <Label htmlFor="currency">💱 Moroccan Dirham (MAD) Exchange Info</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-medium">⚽ World Cup Morocco Packing Checklist</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(formData.packingItems).map(([item, checked]) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={checked}
                      onCheckedChange={(isChecked) => 
                        setFormData(prev => ({ 
                          ...prev, 
                          packingItems: { 
                            ...prev.packingItems, 
                            [item]: !!isChecked 
                          } 
                        }))
                      }
                    />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                🌟 Your {travelThemes.find(t => t.value === formData.travelTheme)?.label} to Morocco 2030 is about to begin! ⚽
              </h3>
              <p className="text-muted-foreground">
                Get ready for the ultimate World Cup experience in the beautiful Kingdom of Morocco!
              </p>
              <Button type="submit" disabled={disabled} size="lg" className="w-full md:w-auto">
                <Plane className="w-5 h-5 mr-2" />
                🚀 Plan My Morocco World Cup Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

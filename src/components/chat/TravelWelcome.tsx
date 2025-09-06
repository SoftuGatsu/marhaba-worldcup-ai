import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Calendar, DollarSign, Sparkles, Utensils, Hotel, Cloud, Search, MapIcon } from 'lucide-react';

interface TravelWelcomeProps {
  onStartPlanning: () => void;
}

export const TravelWelcome: React.FC<TravelWelcomeProps> = ({ onStartPlanning }) => {
  const aiAgents = [
    {
      icon: Plane,
      title: "Flight Agent",
      description: "Find the best flights with prices, schedules, and CO2 emissions"
    },
    {
      icon: Hotel,
      title: "Hotel Agent", 
      description: "Discover top-rated accommodations with ratings and booking links"
    },
    {
      icon: Utensils,
      title: "Food Recommender",
      description: "Get personalized meal suggestions based on your taste preferences"
    },
    {
      icon: Utensils,
      title: "Restaurant Agent",
      description: "Find the best restaurants and local dining experiences"
    },
    {
      icon: MapIcon,
      title: "Activities Agent",
      description: "Discover cultural attractions and memorable experiences"
    },
    {
      icon: Cloud,
      title: "Weather Agent",
      description: "Get weather forecasts and climate information for your trip"
    },
    {
      icon: Search,
      title: "Research Agent",
      description: "Access comprehensive information about Morocco's World Cup venues"
    },
    {
      icon: DollarSign,
      title: "Travel Booking Agent",
      description: "Find the best accommodation deals within your budget"
    }
  ];

  const features = [
    {
      icon: Plane,
      title: "Flight to Morocco",
      description: "Find the best international flights to Morocco's major airports for World Cup 2030"
    },
    {
      icon: MapPin,
      title: "Stadium & City Guide",
      description: "Explore all 6 World Cup host cities with match schedules and local attractions"
    },
    {
      icon: Calendar,
      title: "Match Planning", 
      description: "Plan your trip around specific matches and tournament dates"
    },
    {
      icon: DollarSign,
      title: "Morocco Budget Guide",
      description: "Complete cost breakdown for accommodation, food, and activities in Morocco"
    }
  ];

  const sampleDestinations = [
    { code: "AGD", name: "Agadir", emoji: "�️", stadium: "Adrar Stadium" },
    { code: "CMN", name: "Casablanca", emoji: "�️", stadium: "Hassan II Stadium" },
    { code: "FEZ", name: "Fez", emoji: "🕌", stadium: "Fez Stadium" },
    { code: "RAK", name: "Marrakesh", emoji: "�", stadium: "Marrakesh Stadium" },
    { code: "RBA", name: "Rabat", emoji: "👑", stadium: "Prince Moulay Abdellah Stadium" },
    { code: "TNG", name: "Tangier", emoji: "⛵", stadium: "Ibn Batouta Stadium" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-r from-primary to-primary/80 p-6 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          🇲🇦 Morocco 2030 WorldCup AI
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your AI-powered travel companion for the FIFA World Cup 2030 in Morocco! 
          Plan your perfect journey to the Kingdom with smart recommendations for flights, hotels, and match experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button 
            onClick={onStartPlanning}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plane className="w-6 h-6 mr-3" />
            Plan My Morocco World Cup Trip
          </Button>
          
          <div className="text-sm text-muted-foreground">
            No signup required • Instant results
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Agents Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">🤖 Our Specialized AI Agents</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Our intelligent agents work together to provide you with personalized recommendations for every aspect of your Morocco trip.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiAgents.map((agent, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
              <CardContent className="p-4 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                    <agent.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-sm">{agent.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{agent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            💡 Simply ask questions or use our form - our agents will automatically handle your requests!
          </p>
        </div>
      </div>

      {/* Host Cities & Stadiums */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">�️ World Cup 2030 Host Cities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleDestinations.map((destination, index) => (
            <Card key={index} className="group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <div className="text-4xl group-hover:scale-110 transition-transform mb-2">
                    {destination.emoji}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{destination.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">{destination.stadium}</p>
                    <p className="text-xs text-primary font-mono">{destination.code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">🚀 How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold">Choose Your City</h3>
            <p className="text-sm text-muted-foreground">
              Select which Moroccan city you want to visit for the World Cup
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold">AI Morocco Planning</h3>
            <p className="text-sm text-muted-foreground">
              Our AI creates the perfect Morocco itinerary with matches, culture, and experiences
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold">Your Morocco Adventure</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed plans with flights, riads, match tickets, and cultural experiences
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-semibold">Ready for Morocco 2030 World Cup?</h3>
            <p className="text-muted-foreground">
              Join thousands of football fans planning their ultimate Morocco World Cup experience
            </p>
            <Button 
              onClick={onStartPlanning}
              size="lg"
              className="mt-4"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Plan My Morocco World Cup Trip
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

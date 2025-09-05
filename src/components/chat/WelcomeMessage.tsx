import React from 'react';

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="btn-glass text-sm px-4 py-2 whitespace-nowrap hover:scale-105 transition-all duration-200"
  >
    {text}
  </button>
);

interface WelcomeMessageProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "Plan my World Cup trip to Casablanca",
    "Best time to visit Morocco for the World Cup",
    "Traditional Moroccan food I must try",
    "How to get from Marrakesh to other host cities",
    "Budget for 10 days in Morocco during World Cup",
    "Cultural etiquette tips for Morocco"
  ];

  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="chat-card max-w-[95%]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">M</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Marhaba! Welcome to Morocco 2030 World Cup Planner
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            I'm your AI-powered travel concierge for Morocco's FIFA World Cup 2030 experience. 
            I can help you plan your trip, find flights, discover host cities, and make your football journey unforgettable.
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3 font-medium">
            Try asking me about:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                text={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
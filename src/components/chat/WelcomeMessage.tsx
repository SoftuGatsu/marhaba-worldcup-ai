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
    "Plan my 3-day itinerary in Marrakech",
    "Find flights to Morocco for July",
    "What's a traditional Moroccan dish?",
    "Show me the best riads in Casablanca"
  ];

  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="chat-card max-w-[95%]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">M</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Marhaba! Welcome to your 2030 World Cup Co-pilot
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            I'm your AI-powered travel concierge for Morocco's World Cup experience. 
            I can help you plan your trip, find flights, discover local cuisine, and make your journey unforgettable.
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
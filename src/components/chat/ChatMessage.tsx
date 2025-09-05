import React from 'react';
import { Message } from '@/types/api';
import { TextMessage } from './messages/TextMessage';
import { ItineraryDayCard } from './messages/ItineraryDayCard';
import { FlightCard } from './messages/FlightCard';
import { ImageGallery } from './messages/ImageGallery';
import { RecipeCard } from './messages/RecipeCard';
import { LinkCard } from './messages/LinkCard';
import { FoodRecommendationsCard } from './messages/FoodRecommendationsCard';
import { AccommodationRecommendationsCard } from './messages/AccommodationRecommendationsCard';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const renderMessage = () => {
    switch (message.type) {
      case 'text':
        return <TextMessage payload={message.payload} />;
      case 'itinerary_day':
        return <ItineraryDayCard payload={message.payload} />;
      case 'flight_details':
        return <FlightCard payload={message.payload} />;
      case 'image_gallery':
        return <ImageGallery payload={message.payload} />;
      case 'recipe_card':
        return <RecipeCard payload={message.payload} />;
      case 'link_card':
        return <LinkCard payload={message.payload} />;
      case 'food_recommendations':
        return <FoodRecommendationsCard payload={message.payload} />;
      case 'accommodation_recommendations':
        return <AccommodationRecommendationsCard payload={message.payload} />;
      default:
        return (
          <div className="chat-bubble-ai">
            <p>Unknown message type: {message.type}</p>
          </div>
        );
    }
  };

  return <div className="animate-fade-in">{renderMessage()}</div>;
};
import React from 'react';
import { ItineraryDayPayload } from '@/types/api';
import { Clock, MapPin, ExternalLink } from 'lucide-react';

interface ItineraryDayCardProps {
  payload: ItineraryDayPayload;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ payload }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="chat-card">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-gradient-to-r from-primary to-primary-glow text-white px-3 py-1 rounded-full text-sm font-semibold">
            Day {payload.day}
          </div>
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
          {payload.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {formatDate(payload.date)}
        </p>
      </div>

      <div className="space-y-4">
        {payload.events.map((event, index) => (
          <div key={index} className="relative pl-8 pb-4 last:pb-0">
            {/* Timeline line */}
            {index < payload.events.length - 1 && (
              <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent"></div>
            )}
            
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-sm"></div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary text-sm">
                    {event.time}
                  </span>
                </div>
                {event.map_link && (
                  <a
                    href={event.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-accent hover:text-accent/80 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              <h4 className="font-semibold text-foreground mb-1">
                {event.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
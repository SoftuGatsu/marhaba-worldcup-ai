import React from 'react';
import { FlightDetailsPayload } from '@/types/api';
import { Plane, Leaf, ExternalLink } from 'lucide-react';

interface FlightCardProps {
  payload: FlightDetailsPayload;
}

export const FlightCard: React.FC<FlightCardProps> = ({ payload }) => {
  return (
    <div className="chat-card">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-xl p-6 border border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {payload.logo_url ? (
              <img 
                src={payload.logo_url} 
                alt={payload.airline}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary" />
              </div>
            )}
            <span className="font-semibold text-foreground">{payload.airline}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{payload.price}</div>
            {payload.carbon_offset && (
              <div className="flex items-center space-x-1 text-nature text-sm">
                <Leaf className="w-3 h-3" />
                <span>{payload.carbon_offset}</span>
              </div>
            )}
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {payload.departure.code}
            </div>
            <div className="text-sm text-muted-foreground">
              {payload.departure.city}
            </div>
            <div className="text-lg font-semibold text-primary mt-1">
              {payload.departure.time}
            </div>
          </div>

          <div className="flex-1 mx-6 relative">
            <div className="border-t-2 border-dashed border-primary/40"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full border border-primary/20">
              <Plane className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {payload.arrival.code}
            </div>
            <div className="text-sm text-muted-foreground">
              {payload.arrival.city}
            </div>
            <div className="text-lg font-semibold text-primary mt-1">
              {payload.arrival.time}
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <a
          href={payload.booking_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-moroccan w-full flex items-center justify-center space-x-2 group"
        >
          <span>Book Flight</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
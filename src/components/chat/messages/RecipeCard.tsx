import React from 'react';
import { RecipeCardPayload } from '@/types/api';
import { ExternalLink, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  payload: RecipeCardPayload;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ payload }) => {
  return (
    <div className="chat-card">
      <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-xl overflow-hidden border border-accent/20">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={payload.image_url}
            alt={payload.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-accent/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <ChefHat className="w-3 h-3" />
            <span>Recipe</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
            {payload.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {payload.description}
          </p>
          
          <a
            href={payload.recipe_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 font-medium transition-colors group"
          >
            <span>View Full Recipe</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
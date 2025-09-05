import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChefHat, MapPin } from 'lucide-react';
import { FoodRecommendationsPayload } from '@/types/api';

interface FoodRecommendationsCardProps {
  payload: FoodRecommendationsPayload;
}

export const FoodRecommendationsCard: React.FC<FoodRecommendationsCardProps> = ({ payload }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-lg">Food Recommendations</CardTitle>
        </div>
        <CardDescription>
          Based on your taste for <strong>{payload.taste_preferences}</strong> and preference for <strong>{payload.cuisine_type}</strong> cuisine
          {payload.dietary_restrictions && (
            <span> • Considering dietary restrictions: <strong>{payload.dietary_restrictions}</strong></span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payload.recommendations.map((recommendation, index) => (
          <Card key={index} className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold text-orange-700">
                    {recommendation.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {recommendation.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="text-gray-700">Flavor Profile:</strong>
                  <p className="text-gray-600 mt-1">{recommendation.flavor_profile}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Why it matches:</strong>
                  <p className="text-gray-600 mt-1">{recommendation.why_matches}</p>
                </div>
              </div>
              
              <div>
                <strong className="text-gray-700">Key Ingredients:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recommendation.key_ingredients.map((ingredient, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              {recommendation.cultural_significance && (
                <div>
                  <strong className="text-gray-700">Cultural Significance:</strong>
                  <p className="text-gray-600 mt-1 text-sm">{recommendation.cultural_significance}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{payload.cuisine_type} cuisine</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(recommendation.recipe_link, '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

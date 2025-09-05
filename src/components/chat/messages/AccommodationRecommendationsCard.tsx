import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bed, Calendar, DollarSign, Star, MapPin } from 'lucide-react';
import { AccommodationRecommendationsPayload } from '@/types/api';

interface AccommodationRecommendationsCardProps {
  payload: AccommodationRecommendationsPayload;
}

export const AccommodationRecommendationsCard: React.FC<AccommodationRecommendationsCardProps> = ({ payload }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Accommodation Recommendations</CardTitle>
        </div>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{payload.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{payload.check_in} - {payload.check_out}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>Max {payload.budget_per_night}/night</span>
            </div>
            <Badge variant="outline">{payload.accommodation_type}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payload.recommendations.map((accommodation, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold text-blue-700">
                      {accommodation.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {accommodation.type}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {accommodation.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {accommodation.price_per_night}/night
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: {accommodation.total_cost}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="text-gray-700">Why good value:</strong>
                  <p className="text-gray-600 mt-1">{accommodation.why_good_value}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <strong className="text-gray-700">Location Score:</strong>
                  <span className="text-gray-600 ml-1">{accommodation.location_score}</span>
                </div>
              </div>
              
              <div>
                <strong className="text-gray-700">Key Features:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {accommodation.key_features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {accommodation.special_offers && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-green-600 font-semibold text-sm">🎉 Special Offer:</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">{accommodation.special_offers}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{payload.destination}</span>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(accommodation.booking_link, '_blank')}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

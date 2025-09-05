// API Types for Marhaba AI

export interface ApiRequest {
  query: string;
  sessionId: string;
}

export interface ApiResponse {
  messages: Message[];
}

export type MessageType = 
  | 'text'
  | 'itinerary_day'
  | 'flight_details'
  | 'image_gallery'
  | 'recipe_card'
  | 'link_card';

export interface Message {
  type: MessageType;
  payload: any;
}

export interface TextMessagePayload {
  content: string;
}

export interface ItineraryDayPayload {
  day: number;
  date: string;
  title: string;
  events: ItineraryEvent[];
}

export interface ItineraryEvent {
  time: string;
  title: string;
  description: string;
  map_link?: string;
}

export interface FlightDetailsPayload {
  airline: string;
  logo_url?: string;
  departure: {
    code: string;
    city: string;
    time: string;
  };
  arrival: {
    code: string;
    city: string;
    time: string;
  };
  price: string;
  carbon_offset?: string;
  booking_link: string;
}

export interface ImageGalleryPayload {
  images: {
    url: string;
    alt: string;
  }[];
}

export interface RecipeCardPayload {
  name: string;
  image_url: string;
  description: string;
  recipe_link: string;
}

export interface LinkCardPayload {
  url: string;
  title: string;
  description: string;
  favicon_url?: string;
}
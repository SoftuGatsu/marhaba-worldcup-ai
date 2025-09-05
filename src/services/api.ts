import { ApiRequest, ApiResponse } from '@/types/api';

class MarhabaApiService {
  private baseUrl = '/api/marhaba'; // This will be proxied to the actual backend
  
  async sendMessage(query: string, sessionId: string): Promise<ApiResponse> {
    const request: ApiRequest = {
      query,
      sessionId
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Mock API for development/demo purposes
  async sendMessageMock(query: string, sessionId: string): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock responses based on query content
    const mockResponse: ApiResponse = {
      messages: [
        {
          type: 'text',
          payload: {
            content: `Great question! Here's what I found for your request: "${query}". Morocco offers incredible experiences during the 2030 World Cup.`
          }
        }
      ]
    };

    if (query.toLowerCase().includes('itinerary') || query.toLowerCase().includes('plan')) {
      mockResponse.messages.push({
        type: 'itinerary_day',
        payload: {
          day: 1,
          date: '2030-07-12',
          title: 'Arrival & Medina Exploration',
          events: [
            {
              time: '14:00',
              title: 'Check into Riad',
              description: 'Settle into your eco-friendly Riad in the heart of the Medina.',
              map_link: 'https://maps.google.com/?q=Marrakech+Medina'
            },
            {
              time: '16:00',
              title: 'Jemaa el-Fnaa Square',
              description: 'Experience the vibrant heart of the city with street performers and local cuisine.',
              map_link: 'https://maps.google.com/?q=Jemaa+el-Fnaa'
            },
            {
              time: '19:30',
              title: 'Dinner at Nomad',
              description: 'Enjoy modern Moroccan cuisine with a stunning rooftop view of the medina.',
              map_link: 'https://maps.google.com/?q=Nomad+Restaurant+Marrakech'
            }
          ]
        }
      });
    }

    if (query.toLowerCase().includes('flight')) {
      mockResponse.messages.push({
        type: 'flight_details',
        payload: {
          airline: 'Royal Air Maroc',
          logo_url: 'https://logos-world.net/wp-content/uploads/2023/01/Royal-Air-Maroc-Logo.png',
          departure: {
            code: 'JFK',
            city: 'New York',
            time: '22:00'
          },
          arrival: {
            code: 'RAK',
            city: 'Marrakesh',
            time: '11:30'
          },
          price: '€850',
          carbon_offset: 'Included',
          booking_link: 'https://www.royalairmaroc.com'
        }
      });
    }

    return mockResponse;
  }
}

export const marhabaApi = new MarhabaApiService();
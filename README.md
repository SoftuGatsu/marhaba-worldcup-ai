# Marhaba World Cup AI - Travel Assistant with Agent Integration

An intelligent travel assistant for the 2030 FIFA World Cup in Morocco, featuring integrated AI agents for food recommendations and accommodation booking.

## 🤖 AI Agent Features

### Food Recommender Agent
Provides personalized food recommendations based on:
- Taste preferences (sweet, spicy, savory, etc.)
- Cuisine type preferences
- Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- Cultural context and authenticity

**Example queries:**
- "I want spicy Moroccan food for dinner"
- "Recommend vegetarian Italian dishes"
- "What are some traditional Moroccan sweets?"

### Travel Booking Agent
Finds the best accommodation options based on:
- Budget per night
- Accommodation type (hotel, riad, hostel, etc.)
- Destination and dates
- Special offers and deals

**Example queries:**
- "Find me a hotel in Marrakech for €150 per night"
- "I need a traditional riad for 4 nights starting June 15th"
- "Show me budget hostels in Morocco"

## 🚀 Features

- **Smart Query Detection**: Automatically routes queries to appropriate agents
- **Rich UI Components**: Beautiful cards displaying recommendations
- **Real-time Integration**: Connects with external agent services
- **Conversation Management**: Multi-conversation support with history
- **Responsive Design**: Works on all device sizes
- **Agent-Only Mode**: Configurable to use only agent responses (no hardcoded fallbacks)

## ⚙️ Configuration

### Agent-Only Mode

The application can be configured to use only agent-generated responses, removing all hardcoded fallbacks:

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Set the agent-only mode:
   ```env
   VITE_AGENT_ONLY_MODE=true
   ```

**Behavior:**
- `true`: Only uses agent services for responses. If agents are unavailable, returns error messages.
- `false` or unset: Falls back to real backend API when agents are unavailable.

This ensures that all responses come from your actual AI agents rather than hardcoded mock data.

## Project info

**URL**: https://lovable.dev/projects/5125bce7-4fdc-4c04-93b9-c7017ad51342

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5125bce7-4fdc-4c04-93b9-c7017ad51342) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.

## 🧪 Testing the Agent Integration

Once the development server is running, you can test the agent integration with these sample queries:

### Food Recommendations
```
"I want spicy Moroccan food for dinner"
"Recommend vegetarian dishes with Mediterranean flavors"
"What are some traditional sweets from Morocco?"
"Show me Italian pasta dishes that are creamy and rich"
```

### Accommodation Recommendations
```
"Find me a hotel in Marrakech under €200 per night"
"I need a traditional riad for my World Cup trip"
"Show me budget accommodations in Morocco for June 2030"
"Book me a luxury resort with spa facilities"
```

### General Travel Queries
```
"Plan a 3-day itinerary in Marrakech"
"Find flights from New York to Morocco"
"Show me attractions near the stadiums"
```

## 🔧 Agent Configuration

The agents are configured to work with the external `food-recommender` and `travel-booking` agents. See `AGENT_INTEGRATION.md` for detailed information on:

- Setting up backend API endpoints
- Configuring real agent integration
- Parsing agent responses
- Error handling and fallbacks

### Timeout Configuration

The application includes robust timeout handling to prevent requests from hanging indefinitely:

- **Connection Test**: 5 seconds
- **Agent Requests**: 30 seconds total
- **Response Reading**: 25 seconds maximum
- **Visual Feedback**: Shows elapsed time after 5 seconds

### Testing Agent Connectivity

You can test your agent services directly using curl:

```bash
# Test food recommender agent
curl -X POST "http://localhost:8080/agent/food-recommender" \
  -H "Content-Type: application/json" \
  -d '{"input": "hello"}'

# Test travel booking agent
curl -X POST "http://localhost:8080/agent/travel-booking" \
  -H "Content-Type: application/json" \
  -d '{"input": "find hotels in Morocco"}'

# Test other available agents
curl -X POST "http://localhost:8080/agent/flight-agent" \
  -H "Content-Type: application/json" \
  -d '{"input": "flights to Morocco"}'
```

### Troubleshooting Common Issues

**"Request timed out" errors:**
- Check if agent services are running on localhost:8080
- Verify agent services are responding within 30 seconds
- Monitor system resources (CPU, memory) on the agent host

**"Agent service not found" errors:**
- Ensure the correct agent names are configured
- Verify the proxy configuration in `vite.config.ts`
- Check agent service logs for startup errors

**Connection refused errors:**
- Confirm agent services are running on the correct port
- Verify firewall settings aren't blocking localhost:8080
- Test connectivity with the curl commands above

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── messages/
│   │   │   ├── FoodRecommendationsCard.tsx      # Food agent UI
│   │   │   ├── AccommodationRecommendationsCard.tsx  # Travel agent UI
│   │   │   └── ...
│   │   └── ...
├── services/
│   ├── agentService.ts                          # Agent integration service
│   ├── api.ts                                   # Main API service
├── types/
│   └── api.ts                                   # Type definitions
└── ...
```
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5125bce7-4fdc-4c04-93b9-c7017ad51342) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

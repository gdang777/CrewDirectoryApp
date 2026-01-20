# Changelog

## [Unreleased]

### Personalized Recommendations (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Added personalized "Recommended for You" section to the Home Page.
- **Technical Changes**:
  - Created `UserInteraction` entity to track user behavior (views, clicks, saves).
  - Implemented `RecommendationsService` with category-based scoring algorithm.
  - Added `RecommendationsController` with endpoints for tracking and fetching recommendations.
  - Created `RecommendationsSection` frontend component.
  - Integrated interaction tracking into `PlaceCard`.

### UI Polish & Fixes

- **Date**: 2026-01-20
- **Custom Airplane Loading Animation**: Replaced generic loading spinner with animated airplane orbit loader. Applied to `CityPage`, `PlaceDetailsPage`, `ProductsPage`, `AllCitiesPage`.
- **Add Property Sign-In Prompt**: Added a styled modal that prompts unauthenticated users to sign in before adding a property listing.

### Property Details Page (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Built a comprehensive property details page accessible via "View Details" button.
- **Technical Changes**:
  - Created `PropertyDetailsPage.tsx` with hero image, amenities grid, description, house rules, and booking card.
  - Created `PropertyDetailsPage.css` with dark/neon theme styling.
  - Added route `/property/:propertyId` to `App.tsx`.
  - Updated `PropertyCard` to link to details page.

### Property Host Messaging (Feature Complete)

- **Date**: 2026-01-20
- **Status**: **COMPLETE**
- **Description**: Enabled potential tenants to contact property hosts via chat.
- **Technical Changes**:
  - Updated "Contact Host" button to navigate to `/chat/property-{propertyId}`.
  - Added authentication check with styled sign-in modal.
  - Integrated with existing `ChatPage` infrastructure.

---

### AI Provider Switch (Feature Skipped)

- **Date**: 2026-01-20
- **Status**: **FAILED / SKIPPED**
- **Description**: Attempted to switch AI provider from OpenAI to Perplexity/Gemini to resolve 429 quota errors.
- **Issues Encountered**:
  - Persistent connectivity and verification issues with Perplexity API.
  - Despite backend configuration updates, the integration could not be reliably verified in the UI.
  - "Offline Mode" fallback was hardened in `ItineraryService` to prevent 500 crashes, but the primary AI generation remains unstable.
- **Decision**: Feature deprioritized to focus on "Personalized Recommendations".
- **Technical Changes**:
  - Refactored `apps/api/src/modules/ai/ai.service.ts` to support multiple providers (OpenAI, Perplexity, Gemini).
  - Updated `apps/api/src/modules/ai/itinerary.service.ts` with emergency fallback logic to ensure response delivery.
  - Updated configuration in `apps/api/.env` and `.env.example`.

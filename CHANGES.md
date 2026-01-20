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

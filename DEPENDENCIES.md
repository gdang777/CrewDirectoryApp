# Dependency Tracking & Breaking Changes

This document tracks dependencies between modules and ensures changes don't break existing functionality.

## Module Dependencies

### Module A: Playbooks
**Depends on:**
- `User` entity (from shared)
- `City` entity
- Auth module (for verification)

**Used by:**
- Web app (PlaybooksPage)
- Mobile app (PlaybooksScreen)
- API client

**Breaking Changes to Watch:**
- User entity structure changes
- City entity structure changes
- API endpoint changes (`/playbooks/*`)

### Module B: Products
**Depends on:**
- None (standalone module)

**Used by:**
- Web app (ProductsPage)
- Mobile app (future)
- Price scraping service

**Breaking Changes to Watch:**
- Product entity structure
- Price comparison API contract
- Affiliate link structure

### Module C: Crew Match
**Depends on:**
- `User` entity
- Redis (for real-time features)

**Used by:**
- Web app (future)
- Mobile app (future)

**Breaking Changes to Watch:**
- Pairing entity structure
- Availability window structure
- WebSocket API contract

### Module D: Audio Walks
**Depends on:**
- `User` entity (for creators)
- File storage (S3)

**Used by:**
- Web app (future)
- Mobile app (future)

**Breaking Changes to Watch:**
- Audio walk entity structure
- Waypoint structure
- Purchase flow

## Shared Packages

### @crewdirectoryapp/shared
**Contains:**
- Type definitions (User, City, Playbook, Product, etc.)
- Common interfaces

**Used by:**
- All apps (web, mobile, api)
- All modules

**⚠️ CRITICAL: Changes here affect ALL modules**

### @crewdirectoryapp/api-client
**Contains:**
- API client implementation
- Request/response handling

**Used by:**
- Web app
- Mobile app

**⚠️ CRITICAL: Changes here affect all frontend apps**

## API Contracts

### Playbooks API
```
GET /playbooks - Returns Playbook[]
GET /playbooks/:id - Returns Playbook
POST /playbooks - Creates Playbook (requires auth)
GET /playbooks/cities - Returns City[]
GET /playbooks/pois/nearby - Returns POI[]
POST /playbooks/votes - Creates Vote (requires auth)
```

**Contract Tests:** `apps/api/src/test/integration/playbooks.integration.spec.ts`

### Products API
```
GET /products - Returns Product[]
GET /products/:id - Returns Product
GET /products/compare - Returns price comparison
GET /products/price-delta - Returns Product[] with price deltas
POST /products/affiliate-links - Creates affiliate link (requires auth)
POST /products/qr-scan - Scans QR code (requires auth)
```

**Contract Tests:** `apps/api/src/test/integration/products.integration.spec.ts`

## Change Impact Checklist

Before making changes, check:

- [ ] Are there integration tests for this module?
- [ ] Are there E2E tests for this feature?
- [ ] Does this change affect shared types?
- [ ] Does this change affect API contracts?
- [ ] Are dependent modules updated?
- [ ] Are frontend apps updated?
- [ ] Have tests been run?
- [ ] Has CHANGELOG been updated?

## Breaking Change Detection

### Automated Checks
1. **Integration Tests** - Run on every commit
2. **E2E Tests** - Verify full user flows
3. **Type Checking** - Catches type mismatches
4. **API Contract Tests** - Verify response structures

### Manual Checks
1. Review `DEPENDENCIES.md` before changes
2. Check dependent modules
3. Update tests if contracts change
4. Update documentation

## Migration Guide

When making breaking changes:

1. **Deprecate First** - Mark old API as deprecated
2. **Add New API** - Create new endpoint/interface
3. **Update Tests** - Add tests for new API
4. **Update Documentation** - Document migration path
5. **Update CHANGELOG** - Mark as breaking change
6. **Gradual Migration** - Support both for a period
7. **Remove Old** - After migration period

## Testing Strategy

### Unit Tests
- Test individual functions/services
- Mock dependencies
- Fast execution

### Integration Tests
- Test module interactions
- Use real dependencies where possible
- Verify API contracts

### E2E Tests
- Test complete user flows
- Use real database (test)
- Verify end-to-end functionality

### Contract Tests
- Verify API response structures
- Prevent breaking changes
- Run on every commit

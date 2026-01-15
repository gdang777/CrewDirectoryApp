# Regression Prevention Guide

This document explains how we prevent breaking changes and ensure new features don't break existing functionality.

## Automated Safeguards

### 1. Pre-Commit Hooks (Husky)
**What it does:**
- Runs automatically before every commit
- Formats code with Prettier
- Runs tests for changed files
- Prevents commits if tests fail

**How to use:**
```bash
# Hooks run automatically
git commit -m "your message"
# If tests fail, commit is blocked
```

**To bypass (not recommended):**
```bash
git commit --no-verify -m "message"
```

### 2. Integration Tests
**Location:** `apps/api/src/test/integration/`

**What they test:**
- API contract compliance
- Response structure validation
- Service interface verification
- End-to-end request/response flow

**Run manually:**
```bash
cd apps/api
npm run test:integration
```

### 3. E2E Tests
**Location:** `apps/api/src/test/*.e2e-spec.ts`

**What they test:**
- Complete API endpoint flows
- Authentication requirements
- Error handling
- Response formats

**Run manually:**
```bash
cd apps/api
npm run test:e2e
```

### 4. Type Safety (TypeScript)
**What it prevents:**
- Type mismatches
- Missing required properties
- Incorrect function signatures
- Breaking changes to interfaces

**Check types:**
```bash
npm run type-check
```

### 5. CI/CD Pipeline
**Location:** `.github/workflows/test.yml`

**What it does:**
- Runs all tests on every push
- Runs on every pull request
- Blocks merges if tests fail
- Generates coverage reports

## Manual Safeguards

### 1. Dependency Review
**Before making changes:**
1. Check `DEPENDENCIES.md`
2. Identify affected modules
3. Review dependent code
4. Update tests if needed

### 2. API Contract Review
**Before changing APIs:**
1. Check integration tests
2. Verify response structures
3. Update contract tests
4. Update documentation

### 3. Change Impact Checklist
Use this checklist before committing:

- [ ] Have I run all tests? (`npm test`)
- [ ] Have I run integration tests? (`npm run test:integration`)
- [ ] Have I checked for breaking changes?
- [ ] Have I updated dependent code?
- [ ] Have I updated tests?
- [ ] Have I updated CHANGELOG.md?
- [ ] Have I updated DEPENDENCIES.md if needed?

## Testing Strategy

### Unit Tests
- **Purpose:** Test individual functions
- **Speed:** Fast
- **Scope:** Single function/class
- **Run:** `npm test`

### Integration Tests
- **Purpose:** Test module interactions
- **Speed:** Medium
- **Scope:** Multiple modules
- **Run:** `npm run test:integration`

### E2E Tests
- **Purpose:** Test complete flows
- **Speed:** Slower
- **Scope:** Full application
- **Run:** `npm run test:e2e`

### Contract Tests
- **Purpose:** Verify API contracts
- **Speed:** Fast
- **Scope:** API response structures
- **Run:** Part of integration tests

## Common Scenarios

### Scenario 1: Adding a New Field to an Entity
**Steps:**
1. Update entity definition
2. Update TypeScript types in shared package
3. Update all tests that use the entity
4. Update API responses if needed
5. Run all tests
6. Update CHANGELOG

### Scenario 2: Changing an API Endpoint
**Steps:**
1. Check integration tests for that endpoint
2. Update endpoint implementation
3. Update integration tests
4. Update API client if needed
5. Update frontend code
6. Run all tests
7. Update CHANGELOG

### Scenario 3: Modifying Shared Types
**Steps:**
1. ⚠️ **CRITICAL:** Check all modules using the type
2. Update type definition
3. Update all dependent code
4. Run tests for all affected modules
5. Update CHANGELOG with breaking change notice

### Scenario 4: Refactoring Code
**Steps:**
1. Write tests first (if missing)
2. Refactor code
3. Ensure all tests pass
4. Check integration tests
5. Verify no API contracts broken
6. Update documentation

## Breaking Change Protocol

If you must make a breaking change:

1. **Document it** in CHANGELOG.md under "Breaking Changes"
2. **Deprecate first** - mark old API as deprecated
3. **Add new API** - create new endpoint/interface
4. **Support both** - maintain backward compatibility temporarily
5. **Update tests** - add tests for new API
6. **Update docs** - document migration path
7. **Announce** - notify team/users
8. **Remove old** - after migration period

## Monitoring

### Test Coverage
- Minimum: 70% coverage
- Target: 80%+ coverage
- Critical paths: 90%+ coverage

### Test Execution
- Pre-commit: Fast tests only
- CI/CD: All tests
- Before release: Full test suite + E2E

## Best Practices

1. **Write tests first** (TDD) when possible
2. **Run tests frequently** during development
3. **Fix tests immediately** when they fail
4. **Don't skip tests** to make commits faster
5. **Review test failures** carefully
6. **Update tests** when changing functionality
7. **Keep tests fast** - use mocks where appropriate
8. **Test edge cases** - not just happy paths

## Troubleshooting

**Tests failing after a change:**
1. Review what changed
2. Check if it's a breaking change
3. Update tests accordingly
4. Verify dependent code

**Pre-commit hook failing:**
1. Check error message
2. Fix the issue
3. Try committing again
4. Don't use `--no-verify` unless absolutely necessary

**Integration tests failing:**
1. Check if API contract changed
2. Verify response structures
3. Update contract tests
4. Check dependent services

## Resources

- `TESTING.md` - Testing guide
- `DEPENDENCIES.md` - Dependency tracking
- `CHANGELOG.md` - Change history
- `.github/workflows/test.yml` - CI/CD config

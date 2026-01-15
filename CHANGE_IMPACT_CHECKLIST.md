# Change Impact Checklist

Use this checklist **before** making any changes to ensure you don't break existing functionality.

## Pre-Change Checklist

### 1. Identify Impact

- [ ] What module/feature am I changing?
- [ ] What files will be affected?
- [ ] Are there dependencies on this code? (Check `DEPENDENCIES.md`)
- [ ] Are there tests for this code?
- [ ] Is this a breaking change?

### 2. Review Dependencies

- [ ] Check `DEPENDENCIES.md` for module dependencies
- [ ] List all modules that use this code
- [ ] Check shared packages usage
- [ ] Review API contracts if changing endpoints

### 3. Plan Updates

- [ ] What tests need to be updated?
- [ ] What documentation needs updating?
- [ ] What frontend code needs updating?
- [ ] What API clients need updating?

## During Development

### 4. Make Changes

- [ ] Make the change
- [ ] Update related code
- [ ] Update types if needed
- [ ] Update shared packages if needed

### 5. Update Tests

- [ ] Update existing tests
- [ ] Add new tests for new functionality
- [ ] Update integration tests if API changed
- [ ] Update E2E tests if flows changed

### 6. Verify

- [ ] Run unit tests: `npm test`
- [ ] Run integration tests: `npm run test:integration`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Type check: `npm run type-check`
- [ ] Lint: `npm run lint`

## Before Committing

### 7. Final Checks

- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code is formatted (Prettier)
- [ ] CHANGELOG.md updated
- [ ] DEPENDENCIES.md updated (if needed)
- [ ] Documentation updated (if needed)

### 8. Commit

- [ ] Use conventional commit format
- [ ] Pre-commit hooks will run automatically
- [ ] Fix any hook failures before committing

## After Committing

### 9. CI/CD

- [ ] Check GitHub Actions status
- [ ] Verify all tests pass in CI
- [ ] Review any warnings/errors
- [ ] Fix issues if tests fail

## Common Change Scenarios

### Adding a New Field

- [ ] Update entity/type definition
- [ ] Update database migration (if needed)
- [ ] Update API response DTOs
- [ ] Update frontend types
- [ ] Update tests
- [ ] Update API client

### Changing an API Endpoint

- [ ] Update controller
- [ ] Update service
- [ ] Update integration tests
- [ ] Update API client
- [ ] Update frontend code
- [ ] Update documentation

### Modifying Shared Types

- [ ] ⚠️ **CRITICAL** - Check all usages
- [ ] Update type definition
- [ ] Update all dependent code
- [ ] Run tests for ALL modules
- [ ] Mark as breaking change in CHANGELOG

### Refactoring

- [ ] Write tests first (if missing)
- [ ] Refactor code
- [ ] Ensure all tests still pass
- [ ] Verify no API contracts broken
- [ ] Update documentation

## Red Flags 🚩

Stop and review if you see:

- ❌ Tests failing after your change
- ❌ TypeScript errors in other modules
- ❌ Integration tests failing
- ❌ E2E tests failing
- ❌ CI/CD pipeline failing
- ❌ Multiple modules affected unexpectedly

## Getting Help

If unsure about impact:

1. Check `DEPENDENCIES.md`
2. Review integration tests
3. Search codebase for usages
4. Run full test suite
5. Ask for code review

## Quick Reference

```bash
# Run all checks before committing
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:e2e           # E2E tests
npm run type-check         # Type checking
npm run lint               # Linting

# Pre-commit hook runs automatically
git commit -m "your message"
```

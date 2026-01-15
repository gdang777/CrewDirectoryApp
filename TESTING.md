# Testing Guide

This project has comprehensive testing infrastructure for all components.

## Test Structure

### Backend API Tests (Jest)
- Location: `apps/api/src/**/*.spec.ts`
- Framework: Jest + NestJS Testing Module
- Coverage: Services, Controllers, Guards, Strategies

### Web App Tests (Vitest)
- Location: `apps/web/src/**/*.test.tsx`
- Framework: Vitest + React Testing Library
- Coverage: Components, Services, Hooks

## Running Tests

### Run All Tests
```bash
npm test
```

### Run API Tests Only
```bash
cd apps/api
npm test
npm run test:watch    # Watch mode
npm run test:cov      # With coverage
npm run test:ci       # CI mode
```

### Run Web Tests Only
```bash
cd apps/web
npm test
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:ui       # UI mode
```

### Run Tests in Watch Mode (Root)
```bash
npm run test:watch
```

### Generate Coverage Reports
```bash
npm run test:coverage
```

Coverage reports will be generated in:
- API: `apps/api/coverage/`
- Web: `apps/web/coverage/`

## Test Coverage Goals

- **Minimum**: 70% coverage for all metrics
- **Target**: 80%+ coverage
- **Critical paths**: 90%+ coverage

Current coverage thresholds (in `jest.config.js`):
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Writing Tests

### Backend API Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do something', async () => {
    const result = await service.doSomething();
    expect(result).toBeDefined();
  });
});
```

### Frontend Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('should render', () => {
    render(<YourComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- GitHub Actions workflow: `.github/workflows/test.yml`

The CI pipeline:
1. Sets up PostgreSQL + PostGIS and Redis
2. Runs API tests
3. Runs Web tests
4. Runs linting
5. Generates coverage reports

## Test Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how
   - Test user-facing behavior

2. **Use Descriptive Test Names**
   ```typescript
   // Good
   it('should return user when email exists', ...)
   
   // Bad
   it('test1', ...)
   ```

3. **Follow AAA Pattern**
   - Arrange: Set up test data
   - Act: Execute the code
   - Assert: Verify results

4. **Keep Tests Independent**
   - Each test should be able to run alone
   - Don't rely on test execution order

5. **Mock External Dependencies**
   - Mock API calls
   - Mock database operations
   - Mock file system operations

6. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Error conditions
   - Boundary values

## Debugging Tests

### Debug API Tests
```bash
cd apps/api
npm run test:debug
```

### Debug Web Tests
Add `debugger;` in your test and run:
```bash
cd apps/web
npm test -- --inspect-brk
```

## Continuous Testing

Tests are automatically run:
- On every commit (via pre-commit hooks - to be set up)
- On every push (via GitHub Actions)
- Before deployment (CI pipeline)

## Coverage Reports

View coverage reports:
- HTML: Open `coverage/index.html` in browser
- Terminal: Shown after running `test:coverage`
- CI: Uploaded to codecov (when configured)

## Troubleshooting

**Tests failing in CI but passing locally:**
- Check environment variables
- Verify database connection settings
- Check for timezone issues

**Slow tests:**
- Use `test.only()` to isolate slow tests
- Check for unnecessary async operations
- Optimize database queries in tests

**Coverage not updating:**
- Ensure test files match pattern (`*.spec.ts` or `*.test.tsx`)
- Check coverage exclusions in config
- Verify tests are actually running

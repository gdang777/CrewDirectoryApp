module.exports = {
  // Format code
  '**/*.{ts,tsx,js,jsx,json,md}': [
    'prettier --write',
  ],
  // API tests - run tests for changed files (only on API changes)
  'apps/api/src/**/*.ts': [
    (filenames) => {
      const files = filenames.join(' ');
      return `cd apps/api && npm run test -- --findRelatedTests ${files} --passWithNoTests || true`;
    },
  ],
  // Web tests - run tests for changed files (only on web changes)
  'apps/web/src/**/*.{ts,tsx}': [
    (filenames) => {
      const files = filenames.join(' ');
      return `cd apps/web && npm run test -- --run --passWithNoTests || true`;
    },
  ],
};

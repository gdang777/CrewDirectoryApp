module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Code style
        'refactor', // Code refactoring
        'perf',     // Performance improvement
        'test',     // Adding tests
        'chore',    // Maintenance
        'revert',   // Revert changes
        'ci',       // CI/CD changes
        'build',    // Build system
        'security', // Security fixes
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'web',
        'mobile',
        'shared',
        'deps',
        'config',
        'docs',
        'test',
        'ci',
      ],
    ],
  },
};

# Contributing Guide

## Making Changes

When you make changes to the project, please follow these steps:

### 1. Make Your Changes
Work on your feature, fix, or improvement.

### 2. Update CHANGELOG.md
Before committing, update `CHANGELOG.md` under the `[Unreleased]` section:

- **Added** - For new features
- **Changed** - For changes in existing functionality
- **Deprecated** - For soon-to-be removed features
- **Removed** - For now removed features
- **Fixed** - For bug fixes
- **Security** - For vulnerability fixes

Example:
```markdown
## [Unreleased]

### Added
- Product search functionality with filters
- User profile page

### Fixed
- API timeout issue on slow connections
```

### 3. Commit Your Changes
Use conventional commit messages:

```bash
git add .
git commit -m "feat: add product search functionality"
```

Commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `security:` - Security fixes

### 4. Push to GitHub
```bash
git push
```

## Changelog Best Practices

1. **Be specific** - Describe what was added/changed/fixed
2. **Group related changes** - Keep similar changes together
3. **Use present tense** - "Add feature" not "Added feature"
4. **Reference issues** - Link to GitHub issues if applicable
5. **Update on every change** - Don't batch changelog updates

## Example Workflow

```bash
# 1. Make changes to code
# ... edit files ...

# 2. Update CHANGELOG.md
# ... add entry under [Unreleased] ...

# 3. Stage and commit
git add .
git commit -m "feat: add user authentication"

# 4. Push
git push
```

## Release Process

When ready to release a new version:

1. Update CHANGELOG.md:
   - Move `[Unreleased]` entries to a new version section
   - Add release date
   - Update version number

2. Create a git tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. Create a GitHub release with the changelog entries

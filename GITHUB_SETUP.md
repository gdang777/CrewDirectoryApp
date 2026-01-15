# GitHub Setup Instructions

## Option 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `CrewDirectoryApp` (or your preferred name)
3. Description: "A comprehensive mobile and web application for airline crew members"
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README"
6. Click "Create repository"

## Option 2: Use Existing Repository

If you already have a GitHub repository, use its URL.

## Connect Local Repository to GitHub

Once you have the repository URL, run these commands:

```bash
# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/CrewDirectoryApp.git

# Verify remote was added
git remote -v

# Push code to GitHub
git push -u origin main
```

## If You Need to Use SSH Instead

If you prefer SSH authentication:

```bash
git remote add origin git@github.com:YOUR_USERNAME/CrewDirectoryApp.git
git push -u origin main
```

## Troubleshooting

If you get authentication errors:
- Make sure you have GitHub CLI installed: `gh auth login`
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

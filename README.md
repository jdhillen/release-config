# @jdhillen/release-config-test

## Semantic Release Configuration

A shareable semantic-release configuration for standardizing release management across projects.

## Features

- Automated version management based on [Conventional Commits](https://www.conventionalcommits.org/)
- Changelog generation
- Git release tagging
- NPM publishing support
- Commitizen integration for standardized commit messages

## Installation & Setup

```bash
# Using npm
npm install --save-dev @jdhillen/release-config-test

# Run the setup script
npx setup-release-config
```

The setup script will automatically:

1. Create `config/release.config.js` with the proper configuration
2. Add Commitizen configuration to your `package.json`
3. Add the commit script to your `package.json`
4. Add the semantic-release script to your `package.json`

## Manual Setup (Alternative)

If you prefer to set up manually, follow these steps:

1. Create `config/release.config.js`:

```javascript
export default {
  extends: '@jdhillen/release-config-test'
};
```

2. Add Commitizen configuration to your `package.json`:

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

3. Add release scripts to your `package.json`:

```json
{
  "scripts": {
    "commit": "cz",
    "semantic-release": "semantic-release --extends ./config/release.config.js",
  }
}
```

## GitHub Actions Setup

Add this workflow to `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Run semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npm run semantic-release
```

## Configuration Details

This package includes the following semantic-release plugins:

- `@semantic-release/commit-analyzer`
- `@semantic-release/release-notes-generator`
- `@semantic-release/changelog`
- `@semantic-release/npm`
- `@semantic-release/git`
- `@semantic-release/github`

### Default Configuration

```javascript
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    ['@semantic-release/git', {
      assets: ['package.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    "@semantic-release/github", {
      "assets": [
        {"path": "bin/**"},
        {"path": "src/**"},
        {"path": "LICENSE"},
        {"path": "README.md"}
      ]
    }
  ]
};
```

## Commit Message Format

This configuration uses the Conventional Commits specification. Commit messages should be structured as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature (triggers minor version)
- `fix`: Bug fix (triggers patch version)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Breaking Changes

Add `BREAKING CHANGE:` in the commit body to trigger a major version bump:

```
feat: allow config object to include user preferences

BREAKING CHANGE: `preferences` key in config object is now required
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
# GitHub Repository Settings

## Branch Protection Rules

### Main Branch Protection

```json
{
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": ["build", "test", "lint"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "restrictions": {
      "users": [],
      "teams": [],
      "apps": []
    },
    "required_linear_history": true,
    "allow_force_pushes": false,
    "allow_deletions": false
  }
}
```

### Develop Branch Protection

```json
{
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": ["build", "test", "lint"]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false
    },
    "restrictions": null,
    "required_linear_history": false,
    "allow_force_pushes": false,
    "allow_deletions": false
  }
}
```

## Repository Settings

### General Settings

- Default branch: `main`
- Allow merge commits: `false`
- Allow squash merging: `true`
- Allow rebase merging: `true`
- Automatically delete head branches: `true`

### Security Settings

- Enable vulnerability alerts
- Enable automated security updates
- Enable private vulnerability reporting

## Required Secrets

Add these secrets in Repository Settings > Secrets and variables > Actions:

### Required Secrets

- `GITHUB_TOKEN`: Automatically provided by GitHub
- `NPM_TOKEN`: For publishing packages (if needed)
- `SLACK_WEBHOOK_URL`: For Slack notifications (optional)

### Environment Variables

- `NODE_ENV`: Set to `production` for production deployments
- `DATABASE_URL`: Production database connection string
- `API_KEY`: Production API keys

## Environments

### Production Environment

- Protection rules: Required reviewers
- Deployment branches: Only `main` branch
- Environment secrets: Production-specific secrets

### Staging Environment

- Protection rules: None
- Deployment branches: `develop` and `release/*` branches
- Environment secrets: Staging-specific secrets

## Webhooks (Optional)

### Slack Integration

```json
{
  "url": "https://hooks.slack.com/services/...",
  "events": ["push", "pull_request", "release"]
}
```

### Discord Integration

```json
{
  "url": "https://discord.com/api/webhooks/...",
  "events": ["push", "pull_request", "release"]
}
```

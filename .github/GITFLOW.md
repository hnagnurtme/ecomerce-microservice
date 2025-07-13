# GitFlow với GitHub Actions

## 📋 Tổng quan

Dự án này sử dụng GitFlow workflow với GitHub Actions để tự động hóa quá trình phát triển, kiểm thử
và triển khai.

## 🌳 Cấu trúc Branch

### Main Branches

- **`main`**: Branch chính, chứa code production
- **`develop`**: Branch phát triển, tích hợp tất cả features

### Supporting Branches

- **`feature/*`**: Phát triển tính năng mới
- **`release/*`**: Chuẩn bị cho release
- **`hotfix/*`**: Sửa lỗi khẩn cấp trên production

## 🚀 Quy trình GitFlow

### 1. Phát triển Feature

```bash
# Tạo feature branch từ develop
git checkout develop
git pull origin develop
git checkout -b feature/ten-tinh-nang

# Phát triển và commit
git add .
git commit -m "feat: thêm tính năng mới"

# Push và tạo Pull Request
git push origin feature/ten-tinh-nang
```

### 2. Merge Feature vào Develop

- Tạo Pull Request từ `feature/*` vào `develop`
- GitHub Actions sẽ tự động chạy tests và validations
- Sau khi được approve, merge vào develop

### 3. Tạo Release

```bash
# Sử dụng GitHub Actions workflow dispatch
# Hoặc chạy thủ công:
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Cập nhật version và push
npm version 1.0.0 --no-git-tag-version
git commit -am "chore: bump version to 1.0.0"
git push origin release/1.0.0
```

### 4. Deploy Production

- Tạo Pull Request từ `release/*` vào `main`
- Sau khi merge, GitHub Actions sẽ:
    - Tạo Git tag
    - Tạo GitHub Release
    - Deploy lên production
    - Merge ngược về develop

## 🔧 GitHub Actions Workflows

### 1. GitFlow Workflow (`gitflow.yml`)

- **Trigger**: Push vào develop, release/\*, main
- **Chức năng**:
    - Build và test code
    - Tự động tạo release branch
    - Deploy production và tạo tag
    - Merge ngược về develop

### 2. Pull Request Workflow (`pull-request.yml`)

- **Trigger**: Pull Request tạo mới hoặc cập nhật
- **Chức năng**:
    - Validate code quality
    - Kiểm tra naming convention
    - Validate commit messages
    - Comment status trên PR

### 3. Auto Merge & Deploy (`auto-merge-deploy.yml`)

- **Trigger**: Manual dispatch hoặc schedule
- **Chức năng**:
    - Tự động merge approved PRs
    - Tạo release branch
    - Deploy production

## 📝 Quy tắc Naming Convention

### Branch Names

- `feature/user-authentication`
- `feature/payment-integration`
- `bugfix/login-error`
- `hotfix/security-patch`
- `release/1.0.0`

### Commit Messages

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: thêm tính năng đăng nhập`
- `fix: sửa lỗi validation form`
- `docs: cập nhật README`
- `style: format code`
- `refactor: tối ưu user service`
- `test: thêm unit tests`
- `chore: cập nhật dependencies`

## 🎯 Cách sử dụng GitHub Actions

### 1. Tạo Release (Manual)

1. Vào tab **Actions** trong GitHub
2. Chọn workflow **"GitFlow Workflow"**
3. Click **"Run workflow"**
4. Nhập version number (vd: `1.0.0`)
5. Click **"Run workflow"**

### 2. Auto Merge Features

1. Vào tab **Actions**
2. Chọn workflow **"Auto Merge and Deploy"**
3. Chọn action: `merge-features-to-develop`
4. Click **"Run workflow"**

### 3. Deploy Production

1. Vào tab **Actions**
2. Chọn workflow **"Auto Merge and Deploy"**
3. Chọn action: `deploy-to-production`
4. Click **"Run workflow"**

## 🛡️ Branch Protection Rules

Khuyến nghị setup các rules sau trong GitHub:

### Develop Branch

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

### Main Branch

- Require pull request reviews (2 reviewers)
- Require status checks to pass
- Restrict pushes (chỉ từ release branches)
- Require linear history

## 📊 Monitoring & Notifications

### Status Badges

Thêm vào README.md:

```markdown
![GitFlow Workflow](https://github.com/username/repo/workflows/GitFlow%20Workflow/badge.svg)
![Tests](https://github.com/username/repo/workflows/Pull%20Request%20Workflow/badge.svg)
```

### Slack Notifications

Có thể thêm Slack integration vào workflows để nhận thông báo về:

- Feature deployments
- Production releases
- Failed builds

## 🔧 Tùy chỉnh

### Environment Variables

Thêm vào GitHub Secrets:

- `SLACK_WEBHOOK_URL`: Cho notifications
- `DEPLOY_TOKEN`: Cho deployment
- `NPM_TOKEN`: Cho private packages

### Custom Scripts

Có thể thêm scripts trong `package.json`:

```json
{
    "scripts": {
        "test:prod": "npm test -- --coverage",
        "build:prod": "NODE_ENV=production npm run build",
        "deploy": "your-deploy-script"
    }
}
```

## 📚 Tài liệu tham khảo

- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

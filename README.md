# E-commerce Microservice

Hệ thống microservice cho ứng dụng thương mại điện tử được xây dựng với Node.js, TypeScript và các công nghệ hiện đại.

## Cấu trúc dự án

```
ecommerce-microservice/
├── auth-service/        # Service xác thực
├── api-gateway/         # API Gateway
├── package.json         # Dependencies chung
├── .prettierrc          # Cấu hình Prettier
├── .eslintrc.js         # Cấu hình ESLint
├── commitlint.config.js # Cấu hình commit message
└── tsconfig.base.json   # TypeScript config chung
```

## Công cụ được sử dụng

### Code Quality & Formatting

- **Prettier**: Auto-formatting code
- **ESLint**: Linting và code quality
- **TypeScript**: Type safety
- **EditorConfig**: Consistent coding styles

### Git Hooks & Commit Standards

- **Husky**: Git hooks
- **lint-staged**: Run linters on staged files
- **Commitlint**: Conventional commit messages
- **Commitizen**: Interactive commit message generator

## Scripts chính

### Development

```bash
# Cài đặt dependencies cho tất cả services
npm run install:all

# Chạy tất cả services trong development mode
npm run dev:all

# Chạy riêng từng service
npm run dev:auth
npm run dev:gateway
```

### Build & Deploy

```bash
# Build tất cả services
npm run build:all

# Build riêng từng service
npm run build:auth
npm run build:gateway
```

### Code Quality

```bash
# Lint tất cả code
npm run lint

# Fix linting issues
npm run lint:fix

# Format tất cả code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Quy tắc commit

Dự án sử dụng [Conventional Commits](https://www.conventionalcommits.org/). Format commit message:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Các type được hỗ trợ:

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật tài liệu
- `style`: Thay đổi formatting (không ảnh hưởng logic)
- `refactor`: Refactor code
- `test`: Thêm/sửa tests
- `chore`: Cập nhật build tools, dependencies
- `perf`: Cải thiện performance
- `ci`: Thay đổi CI/CD
- `build`: Thay đổi build system
- `revert`: Revert commit trước

### Ví dụ:

```bash
feat(auth): add user registration endpoint
fix(gateway): resolve CORS issue
docs: update API documentation
```

### Sử dụng Commitizen (khuyến nghị):

```bash
npm run commit
```

## Git Hooks

### Pre-commit

- Chạy lint-staged để format và lint code
- Chỉ chạy trên files được staged

### Commit-msg

- Kiểm tra format commit message theo Conventional Commits
- Reject commit nếu message không đúng format

## Development Workflow

1. **Clone dự án và cài đặt dependencies:**

   ```bash
   git clone <repository-url>
   cd ecommerce-microservice
   npm run install:all
   ```

2. **Tạo branch mới:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Phát triển tính năng:**

   ```bash
   npm run dev:all  # hoặc chạy riêng service cần thiết
   ```

4. **Commit changes:**

   ```bash
   git add .
   npm run commit  # hoặc git commit với message theo format
   ```

5. **Push và tạo Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Cấu hình Editor

Dự án bao gồm `.editorconfig` để đảm bảo consistency giữa các editor. Hầu hết các editor hiện đại đều hỗ trợ EditorConfig.

### VS Code Extensions khuyến nghị:

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code
- TypeScript Importer

## Troubleshooting

### Lỗi pre-commit hook

Nếu pre-commit hook fail, hãy fix các lỗi lint rồi commit lại:

```bash
npm run lint:fix
npm run format
git add .
git commit
```

### Bypass hooks (chỉ trong trường hợp khẩn cấp)

```bash
git commit --no-verify -m "emergency fix"
```

## License

ISC

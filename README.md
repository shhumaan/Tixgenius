# TixGenius

TixGenius is a full-stack application for managing event tickets, built with a modern tech stack using a monorepo architecture.

## 📚 Tech Stack

### Frontend
- **Next.js 14**: React framework with server-side rendering and static site generation
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine

### Tools & Infrastructure
- **Turborepo**: High-performance build system for JavaScript/TypeScript monorepos
- **ESLint**: Static code analysis tool for identifying problematic patterns
- **Prettier**: Opinionated code formatter
- **Husky & lint-staged**: Git hooks for running linters and tests before commits
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment
- **Docker**: Containerization for consistent deployments

## 🏗️ Project Structure

```
TixGenius/
├── apps/                      # Application packages
│   ├── backend/               # Express.js API
│   └── frontend/              # Next.js front-end
├── packages/                  # Shared packages
│   ├── eslint-config/         # ESLint configurations
│   ├── shared/                # Shared types and utilities
│   ├── typescript-config/     # TypeScript configurations
│   └── ui/                    # Shared UI components
├── .github/                   # GitHub configuration
│   └── workflows/             # GitHub Actions CI/CD
└── ...root configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tixgenius.git
   cd tixgenius
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy example .env files in both apps
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. Run the development environment:
   ```bash
   npm run dev
   ```

This will start both the frontend and backend in development mode:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## 🔧 Development Workflow

### Available Scripts

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications and packages
- `npm run lint` - Run ESLint on all projects
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests

### Adding a New Feature

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them using conventional commit messages:
   ```bash
   git commit -m "feat: add new feature"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push -u origin feature/your-feature-name
   ```

## 🌍 Deployment

### Docker Deployment

The project includes Dockerfiles for both frontend and backend. To build and run the Docker containers:

```bash
# Build and run backend
cd apps/backend
docker build -t tixgenius-backend .
docker run -p 3001:3001 tixgenius-backend

# Build and run frontend
cd apps/frontend
docker build -t tixgenius-frontend .
docker run -p 3000:3000 tixgenius-frontend
```

### CI/CD Pipeline

The project uses GitHub Actions for CI/CD:
- On Pull Requests: Run linters, type checking, and tests
- On merge to main: Build and publish Docker images to GitHub Container Registry

## 📐 Architecture Diagram

```
┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                │     │                 │     │                 │
│   Frontend     │────►│  Backend API    │────►│   Database      │
│   (Next.js)    │     │  (Express.js)   │     │                 │
│                │     │                 │     │                 │
└────────────────┘     └─────────────────┘     └─────────────────┘
        │                      │                        │
        ▼                      ▼                        ▼
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                  Shared Components & Types                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

# Contributing to NFT Voting Contest

Thank you for your interest in contributing to the NFT Voting Contest project! This document provides guidelines and information to help you get started with contributing to this open-source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

This project adheres to a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## How to Contribute

We welcome contributions in various forms:

- **Bug fixes**: Identify and fix issues in the codebase
- **Feature implementations**: Add new functionality
- **Documentation**: Improve existing documentation or create new guides
- **Testing**: Write tests to ensure code quality
- **Code reviews**: Review pull requests from other contributors

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - for frontend and backend development
- **Yarn** or **npm** - package managers
- **Foundry** - for smart contract development and testing
- **Git** - version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/NFT-VOTING-CONTEST-AnanyaSinha.git
   cd NFT-VOTING-CONTEST-AnanyaSinha
   ```

2. **Install dependencies:**

   **Frontend:**
   ```bash
   cd frontend/nft-voting
   yarn install
   # or
   npm install
   ```

   **Backend:**
   ```bash
   cd backend
   npm install
   ```

   **Smart Contracts:**
   ```bash
   forge install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if available)
   - Fill in required API keys and configuration

### Running the Project

1. **Start the smart contracts (local network):**
   ```bash
   forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast
   ```

2. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Start the frontend:**
   ```bash
   cd frontend/nft-voting
   yarn start
   # or
   npm start
   ```

## Project Structure

```
NFT-VOTING-CONTEST-AnanyaSinha/
├── backend/                 # Backend API server
├── frontend/nft-voting/     # React frontend application
├── src/                     # Smart contract source files
│   └── NFTVOTING.sol       # Main voting contract
├── script/                  # Deployment scripts
├── broadcast/               # Deployment broadcast logs
├── lib/                     # External libraries (Forge std)
├── package.json             # Root package configuration
├── foundry.toml            # Foundry configuration
└── README.md               # Project documentation
```

## Code Style and Standards

### Smart Contracts (Solidity)

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use descriptive variable and function names
- Add NatSpec comments for all public functions
- Keep functions small and focused on single responsibilities
- Use consistent indentation (4 spaces)

### JavaScript/React

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Use functional components with hooks in React
- Add PropTypes for component props

### General

- Write clear, concise comments
- Use meaningful variable and function names
- Keep lines under 80 characters where possible
- Follow the existing code patterns in the project

## Testing

### Smart Contract Testing

```bash
# Run all tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test file
forge test --match-path test/NFTVOTING.t.sol
```

### Frontend Testing

```bash
cd frontend/nft-voting

# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Backend Testing

```bash
cd backend

# Run tests
npm test
```

Ensure all tests pass before submitting a pull request.

## Submitting Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

2. **Make your changes:**
   - Follow the code style guidelines
   - Write tests for new functionality
   - Update documentation if needed

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new voting feature"
   ```

4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch and provide a clear description
   - Reference any related issues

### Pull Request Guidelines

- Provide a clear title and description
- Reference any related issues (e.g., "Fixes #123")
- Include screenshots for UI changes
- Ensure CI/CD checks pass
- Request review from maintainers

## Reporting Issues

Found a bug or have a feature request? Please:

1. Check existing issues to avoid duplicates
2. Use issue templates when available
3. Provide detailed steps to reproduce bugs
4. Include environment information (OS, Node version, etc.)
5. Add screenshots or error logs when relevant

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing to NFT Voting Contest! Your efforts help make this project better for everyone.

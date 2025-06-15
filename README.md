# 🚀 RuleBased

RuleBased is a tool for managing and applying "rule sets" commonly used across projects.  
It is designed to be referenced by agents both during development and runtime.

## 📁 Project Structure

```
rulebased/
├── apps/
│   └── mcp/                    # RuleBased CLI Application
│       ├── bin/index.js        # Executable entry point (with shebang)
│       ├── src/
│       │   ├── main.ts         # CLI main file
│       │   ├── mcp-server.ts   # MCP server implementation
│       │   ├── utils/
│       │   │   └── logger.ts   # stderr logging utility
│       │   └── commands/       # CLI commands
│       │       ├── init.ts     # Initialize command
│       │       ├── sync.ts     # Sync command
│       │       └── get.ts      # Get command
│       ├── .rulebased/
│       │   └── config.json     # Example configuration file
│       ├── rule-sets/
│       │   └── default.md      # Example rule file
│       ├── package.json        # MCP package configuration
│       └── tsconfig.json       # TypeScript configuration
├── packages/                   # Reusable packages (future expansion)
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── package.json                # Root package configuration
└── README.md
```

## 🎯 Key Features

- **Rule Set Management**: Manage natural language rules in .md format
- **Multiple Source Support**: Git repository or local folder-based rule management
- **Project-specific Configuration**: `.rulebased/config.json` configuration file for each project
- **CLI Tools**: Provides rule initialization, synchronization, and search functionality
- **MCP Server**: Agent communication support through Model Context Protocol

## 🛠️ Installation & Setup

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/woojubb/rulebased.git
cd rulebased

# Install dependencies
pnpm install

# Build MCP CLI
pnpm --filter @rulebased/mcp build

# Run in development mode
pnpm --filter @rulebased/mcp dev
```

### NPM Package Usage (Coming Soon)

```bash
# Global installation
npm install -g @rulebased/mcp

# Or run with npx
npx @rulebased/mcp
```

## 🚀 Usage

### 1. Project Initialization

```bash
# Initialize with default local settings
rulebased init

# Initialize with Git repository
rulebased init --type git --repo https://github.com/your-org/rules.git

# Initialize with custom path
rulebased init --path ./custom-rules
```

### 2. Rule Synchronization

```bash
# Sync rule sets
rulebased sync

# Force sync (ignore local changes)
rulebased sync --force
```

### 3. Rule Search

```bash
# Search rules by keywords
rulebased get "typescript style"

# Output in JSON format
rulebased get "git commit" --format json
```

### 4. Start MCP Server

```bash
# Start MCP server (for agent communication)
rulebased mcp
```

## 📂 Configuration File Structure

### `.rulebased/config.json`

```json
{
  "version": "1.0",
  "sources": [
    {
      "name": "default",
      "type": "local",
      "path": "./rule-sets",
      "description": "Local rule sets for this project"
    },
    {
      "name": "shared",
      "type": "git",
      "repository": "https://github.com/your-org/shared-rules.git",
      "branch": "main",
      "path": "./shared-rule-sets",
      "description": "Shared organizational rule sets"
    }
  ],
  "cache": {
    "enabled": true,
    "ttl": 3600
  },
  "settings": {
    "autoSync": false,
    "defaultFormat": "markdown"
  }
}
```

## 🤖 MCP (Model Context Protocol) Support

RuleBased can communicate directly with AI agents through MCP.

### MCP Tools

- **`getRules`**: Search and return rules by keywords
- **`syncRules`**: Synchronize rule sources
- **`initProject`**: Initialize project

### Usage Example

```bash
# Start MCP server
rulebased mcp

# Available tools for agents:
# - getRules(keywords: string, format?: "markdown" | "json")
# - syncRules(force?: boolean)
# - initProject(type?: "local" | "git", repository?: string, path?: string)
```

## 🌐 Domain & Expansion Plans

- **Official Brand Domain**: [https://rulebased.io](https://rulebased.io)
- **Future Expansion Packages**:
  - `@rulebased/core` - Rule parsing core library
  - `@rulebased/gui` - GUI MCP client
  - `@rulebased/cloud` - Cloud rule repository

## 🔧 Development

### Package Development

```bash
# Run commands in specific package
pnpm --filter @rulebased/mcp <command>

# Build all packages
pnpm build

# Type check all packages
pnpm type-check
```

### Adding New Packages

1. Create a new folder in `packages/` or `apps/` directory
2. Write `package.json` file (use appropriate `@rulebased/` namespace)
3. Update `pnpm-workspace.yaml` if necessary

### Logging System

In MCP server mode, stdio is used for protocol communication, so all logs are output to stderr:

```typescript
import { logger } from './utils/logger';

logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.success('Success message');
logger.debug('Debug message'); // Only output when DEBUG environment variable is set
```

## 📜 License

MIT License

## 🤝 Contributing

If you'd like to contribute to this project:

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

---

Made with ❤️ by RuleBased Team 
# MCP Implementation Guide: Getting Started

A comprehensive guide to setting up and using Model Context Protocol (MCP) servers with Claude Desktop, development tools, and AI assistants.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Claude Desktop Setup](#claude-desktop-setup)
3. [VS Code Integration](#vs-code-integration)
4. [JetBrains IDEs Integration](#jetbrains-ides-integration)
5. [CLI Tools Integration](#cli-tools-integration)
6. [OpenAI/ChatGPT Clients](#openaichatgpt-clients)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Quick Start

### What You Need

- **Claude Desktop** (recommended) or compatible AI client
- **Node.js** 18+ or **Python** 3.10+ (depending on MCP server)
- **Terminal/Command Prompt** access
- **Text Editor** for configuration files

### 5-Minute Setup (Claude Desktop + Filesystem)

1. Install Claude Desktop from https://claude.ai/download
2. Open Claude Desktop settings (Gear icon → Settings)
3. Navigate to "Developer" tab
4. Click "Edit Config" to open `claude_desktop_config.json`
5. Add your first MCP server:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/YOUR_USERNAME/Documents"]
    }
  }
}
```

6. Save the file and restart Claude Desktop
7. You should now see MCP tools available in Claude Desktop!

---

## Claude Desktop Setup

### Step-by-Step Installation

#### 1. Install Claude Desktop

**macOS:**
```bash
# Download from website
open https://claude.ai/download

# Or install via Homebrew (if available)
brew install --cask claude
```

**Windows:**
- Download installer from https://claude.ai/download
- Run the installer
- Launch Claude Desktop

**Linux:**
- Download AppImage from https://claude.ai/download
- Make executable: `chmod +x Claude-*.AppImage`
- Run: `./Claude-*.AppImage`

#### 2. Locate Configuration File

Claude Desktop stores MCP configuration in a JSON file:

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

#### 3. Configure Your First MCP Server

Open the configuration file and add MCP servers:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Projects"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "github_pat_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

#### 4. Verify Installation

1. Restart Claude Desktop completely (Quit and reopen)
2. Start a new conversation
3. Look for the 🔌 MCP icon or hammer 🔨 icon in the interface
4. Click it to see available MCP tools
5. Try a command like: "List the files in my Projects directory"

### Popular MCP Servers for Claude Desktop

#### Local File Access
```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/directory"]
}
```

#### GitHub Integration
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "your_token"
  }
}
```

#### Google Drive Access
```json
"gdrive": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gdrive"],
  "env": {
    "GDRIVE_CLIENT_ID": "your_client_id",
    "GDRIVE_CLIENT_SECRET": "your_client_secret"
  }
}
```

#### Postgres Database
```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
}
```

#### Puppeteer (Web Automation)
```json
"puppeteer": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
}
```

#### Memory (Knowledge Graph)
```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

### Using Python-based MCP Servers

For Python MCP servers (like Blender MCP):

```json
"blender": {
  "command": "python",
  "args": ["-m", "blender_mcp"],
  "env": {
    "BLENDER_PATH": "/Applications/Blender.app/Contents/MacOS/Blender"
  }
}
```

Or using uvx (recommended for Python servers):

```json
"blender": {
  "command": "uvx",
  "args": ["blender-mcp"]
}
```

---

## VS Code Integration

VS Code supports MCP through extensions and the integrated terminal.

### Method 1: Claude Dev Extension (Recommended)

1. **Install Claude Dev Extension**
   - Open VS Code
   - Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
   - Search for "Claude Dev" or "Anthropic"
   - Click Install

2. **Configure MCP Servers**
   - Open VS Code settings (Cmd+, / Ctrl+,)
   - Search for "Claude" or "MCP"
   - Add MCP server configurations in settings.json:

```json
{
  "claude.mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "${workspaceFolder}"]
    }
  }
}
```

3. **Use Variables**
   - `${workspaceFolder}` - Current workspace directory
   - `${userHome}` - User home directory
   - `${env:VARIABLE}` - Environment variable

### Method 2: Continue Extension (Alternative)

Continue is an open-source AI coding assistant that supports MCP:

1. Install Continue extension from marketplace
2. Configure in `~/.continue/config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/code"]
    }
  }
}
```

### Method 3: Integrated Terminal

Use Claude Desktop alongside VS Code:
1. Open your project in VS Code
2. Keep Claude Desktop open
3. Claude can read/edit files through filesystem MCP
4. Copy code between Claude Desktop and VS Code

---

## JetBrains IDEs Integration

MCP support for JetBrains IDEs (IntelliJ, PyCharm, WebStorm, etc.)

### Using AI Assistant Plugin

1. **Install AI Assistant Plugin**
   - Open Settings (Cmd+, / Ctrl+Alt+S)
   - Go to Plugins
   - Search for AI Assistant or compatible MCP plugin
   - Install and restart IDE

2. **Configure MCP Backend**

Create config file at:
- macOS/Linux: `~/.config/JetBrains/[IDE]/mcp_config.json`
- Windows: `%APPDATA%\JetBrains\[IDE]\mcp_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${PROJECT_DIR}"]
    }
  }
}
```

3. **Reload IDE** for changes to take effect

### Using External Claude Desktop

Alternative approach:
1. Use Claude Desktop with filesystem MCP pointed at your project
2. Work in JetBrains IDE for coding
3. Use Claude Desktop for AI assistance
4. Changes sync automatically through filesystem

---

## CLI Tools Integration

### Aider (AI Pair Programming)

Aider is a CLI tool that can work with Claude and MCP:

1. **Install Aider**
```bash
pip install aider-chat
```

2. **Configure Claude API**
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

3. **Use with MCP Servers**

Aider doesn't directly support MCP yet, but you can:
- Use Claude Desktop with MCP alongside Aider
- Request MCP integration in Aider's roadmap

### Claude Code (Official CLI)

If available, Claude's official CLI tool:

1. **Install**
```bash
npm install -g @anthropic-ai/claude-cli
# or
pip install anthropic-cli
```

2. **Configure MCP**
```bash
claude config set mcp.filesystem.path /Users/yourname/code
claude config set mcp.github.token your_github_token
```

3. **Usage**
```bash
# Start session with MCP
claude chat --mcp filesystem,github

# In chat, use MCP tools
> List files in current directory
> Create a new branch in GitHub
```

### Cursor (AI Code Editor)

Cursor is built on VS Code and supports Claude:

1. **Download Cursor**: https://cursor.sh
2. **Configure in Settings**:
   - Open Settings → Cursor Settings
   - Add MCP configuration similar to VS Code
3. **Use built-in AI with MCP tools**

### Zed (Next-gen Editor)

Zed editor with AI assistant:

1. **Install Zed**: https://zed.dev
2. **Configure MCP** in `~/.config/zed/settings.json`:

```json
{
  "assistant": {
    "version": "2",
    "provider": "anthropic",
    "mcp_servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/code"]
      }
    }
  }
}
```

---

## OpenAI/ChatGPT Clients

### Current MCP Support Status

**Note**: As of November 2024, MCP is primarily supported by Anthropic's Claude. OpenAI/ChatGPT does not natively support MCP protocol.

### Workarounds for ChatGPT Users

#### Option 1: Use OpenAI-Compatible MCP Bridges

Some community projects provide bridges:

```bash
# Example: MCP-to-OpenAI bridge (hypothetical)
npm install -g mcp-openai-bridge

# Run bridge server
mcp-bridge --provider openai --api-key your_openai_key
```

#### Option 2: Custom GPTs with Actions

Create Custom GPTs that call MCP servers via API:

1. Go to ChatGPT → Explore GPTs → Create
2. Configure Actions with MCP server endpoints
3. Define OpenAPI schema for MCP tools

Example Action Schema:
```yaml
openapi: 3.0.0
info:
  title: MCP Filesystem
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /files/list:
    get:
      summary: List files
      parameters:
        - name: path
          in: query
          schema:
            type: string
```

#### Option 3: Use Claude Desktop + ChatGPT Together

Hybrid approach:
- Use Claude Desktop with MCP for file operations, automation
- Use ChatGPT for general queries
- Copy results between tools as needed

### OpenRouter (Multi-Model Access)

OpenRouter provides access to multiple AI models:

```json
{
  "provider": "openrouter",
  "apiKey": "your-key",
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"]
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Appearing in Claude Desktop

**Symptoms**: No MCP tools visible, no hammer icon

**Solutions**:
- Completely quit and restart Claude Desktop (not just close window)
- Check JSON syntax in config file (use JSONLint.com)
- Verify file path is correct (check for typos)
- Check that Node.js/Python is installed: `node --version` or `python --version`

**Debug**:
```bash
# macOS/Linux: Check Claude logs
tail -f ~/Library/Logs/Claude/main.log

# Windows: Check Event Viewer or
# %APPDATA%\Claude\logs\main.log
```

#### 2. "Command Not Found" Errors

**Symptoms**: Error like `npx: command not found`

**Solutions**:
```bash
# Install Node.js
# macOS
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
# Download from nodejs.org

# Verify installation
node --version
npx --version
```

#### 3. Permission Denied Errors

**Symptoms**: Can't access files or directories

**Solutions**:
```bash
# macOS: Grant Full Disk Access
# System Preferences → Security & Privacy → Privacy → Full Disk Access
# Add Claude Desktop

# Linux: Check file permissions
chmod +r /path/to/directory

# Windows: Run as Administrator or check folder permissions
```

#### 4. Environment Variables Not Working

**Symptoms**: API keys not recognized

**Solutions**:

**macOS/Linux**:
```bash
# Add to ~/.zshrc or ~/.bashrc
export GITHUB_TOKEN="your_token"
export ANTHROPIC_API_KEY="your_key"

# Reload shell
source ~/.zshrc

# Restart Claude Desktop from terminal
open -a "Claude"
```

**Windows**:
```cmd
# Set environment variables
setx GITHUB_TOKEN "your_token"

# Or set in config file directly (less secure)
```

#### 5. MCP Server Crashes

**Symptoms**: Tools work briefly then stop

**Solutions**:
- Check server logs for errors
- Increase timeout in config:
```json
{
  "mcpServers": {
    "myserver": {
      "command": "npx",
      "args": ["..."],
      "timeout": 60000
    }
  }
}
```
- Update MCP server: `npm update -g @modelcontextprotocol/server-*`

### Getting Help

**Official Resources**:
- MCP Documentation: https://modelcontextprotocol.io
- Claude Support: https://support.anthropic.com
- GitHub Issues: https://github.com/modelcontextprotocol/servers/issues

**Community**:
- Discord: MCP Community Server
- Reddit: r/ClaudeAI
- GitHub Discussions: https://github.com/modelcontextprotocol/servers/discussions

---

## Best Practices

### Security

1. **Never Hardcode Secrets**
   ```json
   // ❌ BAD
   "env": {
     "API_KEY": "sk-1234567890abcdef"
   }

   // ✅ GOOD
   "env": {
     "API_KEY": "${env:GITHUB_TOKEN}"
   }
   ```

2. **Limit File Access**
   ```json
   // ❌ BAD - Full system access
   "args": ["-y", "@modelcontextprotocol/server-filesystem", "/"]

   // ✅ GOOD - Specific directory
   "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/Projects"]
   ```

3. **Use Read-Only Tokens**
   - Create tokens with minimum required permissions
   - Use different tokens for different MCP servers
   - Rotate tokens regularly

### Performance

1. **Start with Essential Servers**
   - Don't load all MCP servers at once
   - Enable only what you need
   - Disable unused servers

2. **Optimize Paths**
   ```json
   // ✅ GOOD - Specific paths
   "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src"]

   // ⚠️ SLOW - Large directories
   "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me"]
   ```

3. **Use Local Servers When Possible**
   - Prefer local MCP servers over remote APIs for speed
   - Cache frequently accessed data

### Organization

1. **Name Servers Clearly**
   ```json
   {
     "mcpServers": {
       "project-files": { ... },
       "company-github": { ... },
       "personal-github": { ... }
     }
   }
   ```

2. **Document Configuration**
   ```json
   {
     "mcpServers": {
       // Filesystem access for current project
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"]
       }
     }
   }
   ```

3. **Version Control Config (Carefully)**
   ```bash
   # .gitignore
   claude_desktop_config.json  # Contains secrets

   # Instead, create template
   claude_desktop_config.template.json  # Safe to commit
   ```

### Testing New MCP Servers

1. **Test in Isolation**
   ```json
   {
     "mcpServers": {
       // Disable other servers temporarily
       // "filesystem": { ... },

       // Test new server
       "new-server": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-new"]
       }
     }
   }
   ```

2. **Verify Functionality**
   - Test basic operations
   - Check error handling
   - Monitor performance
   - Read server documentation

3. **Review Permissions**
   - What data can the server access?
   - What operations can it perform?
   - Is this appropriate for your use case?

---

## Advanced Configuration

### Multiple Configurations for Different Projects

**Project-Specific Configs** (if supported):

```bash
# Create project config
.claude/config.json

# Override global settings
{
  "mcpServers": {
    "project-files": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

### Custom MCP Servers

Build your own MCP server:

1. **Create Server**
```typescript
// my-custom-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0"
});

// Implement your tools
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [{
      name: "my_tool",
      description: "Does something cool",
      inputSchema: { type: "object", properties: {} }
    }]
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

2. **Use in Config**
```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["/path/to/my-custom-server.js"]
    }
  }
}
```

### Environment-Specific Configs

```json
{
  "mcpServers": {
    "filesystem-dev": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${env:DEV_PATH}"]
    },
    "filesystem-prod": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${env:PROD_PATH}"]
    }
  }
}
```

---

## Next Steps

1. **Start Simple**: Begin with filesystem MCP server
2. **Add Tools Gradually**: Enable more servers as needed
3. **Explore Use Cases**: Review use case documentation
4. **Join Community**: Connect with other MCP users
5. **Build Custom Servers**: Create tools for your specific workflow

## Additional Resources

- **Blender MCP Use Cases**: See `BLENDER_MCP_USE_CASES.md`
- **Puppeteer MCP Use Cases**: See `PUPPETEER_MCP_USE_CASES.md`
- **MCP Servers Overview**: See `MCP_SERVERS_OVERVIEW.md`
- **Official Examples**: https://github.com/modelcontextprotocol/servers
- **Community Servers**: https://github.com/wong2/awesome-mcp-servers

---

*Last Updated: November 2025*
*MCP Protocol Version: 1.0*

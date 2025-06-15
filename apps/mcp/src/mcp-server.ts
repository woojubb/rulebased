import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs-extra";
import * as path from "path";
import { logger } from "./utils/logger";

// Create an MCP server
const server = new McpServer({
  name: "RuleBased",
  version: "0.0.1"
});

// Tool: Get rules by keywords
server.tool(
  "getRules",
  "Search and retrieve rules based on keywords from configured rule sources",
  { 
    keywords: z.string().describe("Keywords to search for in rules (e.g., 'typescript style', 'git commit')"),
    format: z.enum(["markdown", "json"]).optional().describe("Output format for the rules")
  },
  async ({ keywords, format = "markdown" }) => {
    try {
      const rules = await searchRules(keywords);
      const content = format === "json" 
        ? JSON.stringify(rules, null, 2)
        : formatRulesAsMarkdown(rules);
      
      return {
        content: [{ type: "text", text: content }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching rules: ${error}` }]
      };
    }
  }
);

// Tool: Sync rules from configured sources
server.tool(
  "syncRules",
  "Synchronize rules from configured Git repositories or local sources",
  { 
    force: z.boolean().optional().describe("Force sync even if local changes exist")
  },
  async ({ force = false }) => {
    try {
      const result = await syncRulesFromSources(force);
      return {
        content: [{ type: "text", text: result }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error syncing rules: ${error}` }]
      };
    }
  }
);

// Tool: Initialize RuleBased project
server.tool(
  "initProject",
  "Initialize .rulebased directory and configuration for a project",
  { 
    type: z.enum(["local", "git"]).optional().describe("Configuration type"),
    repository: z.string().optional().describe("Git repository URL for rules"),
    path: z.string().optional().describe("Local path for rules")
  },
  async ({ type = "local", repository, path: rulePath = "./rule-sets" }) => {
    try {
      const result = await initializeProject(type, repository, rulePath);
      return {
        content: [{ type: "text", text: result }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error initializing project: ${error}` }]
      };
    }
  }
);

// Helper functions
async function searchRules(keywords: string): Promise<any[]> {
  const configPath = path.join(process.cwd(), '.rulebased', 'config.json');
  
  if (!await fs.pathExists(configPath)) {
    throw new Error('No .rulebased/config.json found. Run "rulebased init" first.');
  }
  
  const config = await fs.readJson(configPath);
  const results: any[] = [];
  
  for (const source of config.sources || []) {
    const rulePath = path.resolve(source.path);
    if (await fs.pathExists(rulePath)) {
      const files = await fs.readdir(rulePath);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      for (const file of mdFiles) {
        const filePath = path.join(rulePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        if (content.toLowerCase().includes(keywords.toLowerCase())) {
          results.push({
            source: source.name,
            file: file,
            path: filePath,
            content: content
          });
        }
      }
    }
  }
  
  return results;
}

function formatRulesAsMarkdown(rules: any[]): string {
  if (rules.length === 0) {
    return "No rules found matching the keywords.";
  }
  
  let markdown = `# Found ${rules.length} rule(s)\n\n`;
  
  for (const rule of rules) {
    markdown += `## ${rule.file} (${rule.source})\n\n`;
    markdown += `${rule.content}\n\n---\n\n`;
  }
  
  return markdown;
}

async function syncRulesFromSources(force: boolean): Promise<string> {
  const configPath = path.join(process.cwd(), '.rulebased', 'config.json');
  
  if (!await fs.pathExists(configPath)) {
    throw new Error('No .rulebased/config.json found. Run "rulebased init" first.');
  }
  
  const config = await fs.readJson(configPath);
  let syncResults: string[] = [];
  
  for (const source of config.sources || []) {
    if (source.type === 'git') {
      // For now, just report that git sync would happen here
      syncResults.push(`Would sync ${source.name} from ${source.repository}`);
    } else if (source.type === 'local') {
      // Check if local path exists
      const rulePath = path.resolve(source.path);
      if (await fs.pathExists(rulePath)) {
        syncResults.push(`Local source ${source.name} at ${rulePath} is available`);
      } else {
        syncResults.push(`Local source ${source.name} at ${rulePath} not found`);
      }
    }
  }
  
  return syncResults.join('\n');
}

async function initializeProject(type: string, repository?: string, rulePath?: string): Promise<string> {
  const rulebasedDir = path.join(process.cwd(), '.rulebased');
  const configPath = path.join(rulebasedDir, 'config.json');
  
  // Create .rulebased directory
  await fs.ensureDir(rulebasedDir);
  
  // Create default configuration
  const config = {
    version: "1.0",
    sources: [
      {
        name: "default",
        type: type,
        path: rulePath,
        description: `${type === 'git' ? 'Git-based' : 'Local'} rule sets for this project`
      }
    ],
    cache: {
      enabled: true,
      ttl: 3600
    },
    settings: {
      autoSync: false,
      defaultFormat: "markdown"
    }
  };
  
  if (type === 'git' && repository) {
    config.sources[0] = {
      ...config.sources[0],
      repository,
      branch: "main"
    } as any;
  }
  
  await fs.writeJson(configPath, config, { spaces: 2 });
  
  // Create rule-sets directory if local type
  if (type === 'local' && rulePath) {
    const fullRulePath = path.resolve(rulePath);
    await fs.ensureDir(fullRulePath);
    
    // Create example rule if directory is empty
    const files = await fs.readdir(fullRulePath);
    if (files.length === 0) {
      const exampleRule = `# Example Rules

## Getting Started
This is an example rule file. Add your project-specific rules here.

## Best Practices
- Keep rules clear and actionable
- Use markdown formatting for readability
- Organize rules by category
`;
      await fs.writeFile(path.join(fullRulePath, 'example.md'), exampleRule);
    }
  }
  
  return `Project initialized successfully!\n- Configuration: ${configPath}\n- Type: ${type}\n- Rules path: ${rulePath}`;
}

export async function startMcpServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
} 
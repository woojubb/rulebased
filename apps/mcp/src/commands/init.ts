import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { logger } from '../utils/logger';

interface InitOptions {
  type: string;
  repo?: string;
  path: string;
}

export async function initCommand(options: InitOptions) {
  try {
    logger.info('🚀 Initializing RuleBased project...');
    
    const rulebasedDir = path.join(process.cwd(), '.rulebased');
    const configPath = path.join(rulebasedDir, 'config.json');
    
    // Check if already initialized
    if (await fs.pathExists(configPath)) {
      logger.warn('⚠️  Project already initialized!');
      return;
    }
    
    // Create .rulebased directory
    await fs.ensureDir(rulebasedDir);
    
    // Create configuration
    const config = {
      version: "1.0",
      sources: [
        {
          name: "default",
          type: options.type,
          path: options.path,
          description: `${options.type === 'git' ? 'Git-based' : 'Local'} rule sets for this project`
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
    
    if (options.type === 'git' && options.repo) {
      (config.sources[0] as any).repository = options.repo;
      (config.sources[0] as any).branch = "main";
    }
    
    await fs.writeJson(configPath, config, { spaces: 2 });
    
    // Create rule-sets directory if local type
    if (options.type === 'local') {
      const fullRulePath = path.resolve(options.path);
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
        logger.success(`📝 Created example rule file: ${path.join(fullRulePath, 'example.md')}`);
      }
    }
    
    logger.success('✅ Project initialized successfully!');
    logger.info(`📁 Configuration: ${configPath}`);
    logger.info(`🔧 Type: ${options.type}`);
    logger.info(`📂 Rules path: ${options.path}`);
    
  } catch (error) {
    logger.error('❌ Error initializing project:', error);
  }
} 
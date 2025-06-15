#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from './utils/logger';

const program = new Command();

program
  .name('rulebased')
  .description('RuleBased CLI - Manage and apply rule sets in projects')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize .rulebased directory and create initial configuration')
  .option('-t, --type <type>', 'Configuration type (git|local)', 'local')
  .option('-r, --repo <repo>', 'Git repository URL for rules')
  .option('-p, --path <path>', 'Local path for rules', './rule-sets')
  .action(async (options) => {
    const { initCommand } = await import('./commands/init');
    await initCommand(options);
  });

program
  .command('sync')
  .description('Sync rule sets from repository to local storage')
  .option('-f, --force', 'Force sync even if local changes exist')
  .action(async (options) => {
    const { syncCommand } = await import('./commands/sync');
    await syncCommand(options);
  });

program
  .command('get')
  .description('Get rules related to specific keywords')
  .argument('<keywords>', 'Keywords to search for in rules')
  .option('-f, --format <format>', 'Output format (json|markdown)', 'markdown')
  .action(async (keywords: string, options) => {
    const { getCommand } = await import('./commands/get');
    await getCommand(keywords, options);
  });

program
  .command('mcp')
  .description('Start MCP server for rule-based context')
  .action(() => {
    logger.info('🚀 Starting MCP server...');
    import('./mcp-server').then(({ startMcpServer }) => {
      startMcpServer().catch((error) => {
        logger.error('Failed to start MCP server:', error);
      });
    });
  });

program.parse();

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  logger.info('💡 Start with: rulebased init');
} 
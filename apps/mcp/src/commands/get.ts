import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { logger } from '../utils/logger';

interface GetOptions {
  format: string;
}

export async function getCommand(keywords: string, options: GetOptions) {
  try {
    logger.info(`🔍 Searching for rules with keywords: "${keywords}"`);
    
    const configPath = path.join(process.cwd(), '.rulebased', 'config.json');
    
    if (!await fs.pathExists(configPath)) {
      logger.error('❌ No .rulebased/config.json found. Run "rulebased init" first.');
      return;
    }
    
    const config = await fs.readJson(configPath);
    const results: any[] = [];
    
    for (const source of config.sources || []) {
      const rulePath = path.resolve(source.path);
      if (await fs.pathExists(rulePath)) {
        const files = await fs.readdir(rulePath);
        const mdFiles = files.filter((f: string) => f.endsWith('.md'));
        
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
    
    if (results.length === 0) {
      logger.warn(`⚠️  No rules found matching "${keywords}"`);
      return;
    }
    
    logger.success(`✅ Found ${results.length} rule(s) matching "${keywords}"`);
    
    if (options.format === 'json') {
      console.log(JSON.stringify(results, null, 2));
    } else {
      // Markdown format
      for (const result of results) {
        console.log(chalk.cyan(`\n📄 ${result.file} (${result.source})`));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(result.content);
        console.log(chalk.gray('─'.repeat(50)));
      }
    }
    
  } catch (error) {
    logger.error('❌ Error searching rules:', error);
  }
} 
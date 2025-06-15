import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { logger } from '../utils/logger';

interface SyncOptions {
  force: boolean;
}

export async function syncCommand(options: SyncOptions) {
  try {
    logger.info('🔄 Syncing rules...');
    
    const configPath = path.join(process.cwd(), '.rulebased', 'config.json');
    
    if (!await fs.pathExists(configPath)) {
      logger.error('❌ No .rulebased/config.json found. Run "rulebased init" first.');
      return;
    }
    
    const config = await fs.readJson(configPath);
    const syncResults: string[] = [];
    
    for (const source of config.sources || []) {
      logger.info(`📂 Checking source: ${source.name}`);
      
      if (source.type === 'git') {
        // For now, just report that git sync would happen here
        logger.info(`  Git repository: ${source.repository}`);
        syncResults.push(`Would sync ${source.name} from ${source.repository}`);
      } else if (source.type === 'local') {
        // Check if local path exists
        const rulePath = path.resolve(source.path);
        if (await fs.pathExists(rulePath)) {
          const files = await fs.readdir(rulePath);
          const mdFiles = files.filter((f: string) => f.endsWith('.md'));
          logger.success(`  ✅ Local source available with ${mdFiles.length} rule files`);
          syncResults.push(`Local source ${source.name} has ${mdFiles.length} rule files`);
        } else {
          logger.error(`  ❌ Local path not found: ${rulePath}`);
          syncResults.push(`Local source ${source.name} at ${rulePath} not found`);
        }
      }
    }
    
    logger.success('✅ Sync completed!');
    
    if (options.force) {
      logger.warn('⚠️  Force sync option was used');
    }
    
  } catch (error) {
    logger.error('❌ Error syncing rules:', error);
  }
} 
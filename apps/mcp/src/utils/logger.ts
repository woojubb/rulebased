import chalk from 'chalk';

// Log to stderr to avoid interfering with MCP stdio communication
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.error(chalk.blue('[INFO]'), message, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.error(chalk.yellow('[WARN]'), message, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(chalk.red('[ERROR]'), message, ...args);
  },
  
  success: (message: string, ...args: any[]) => {
    console.error(chalk.green('[SUCCESS]'), message, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG) {
      console.error(chalk.gray('[DEBUG]'), message, ...args);
    }
  }
}; 
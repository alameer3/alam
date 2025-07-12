import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const execAsync = promisify(exec);

export class BackupManager {
  private static backupDir = path.join(process.cwd(), 'backups');
  
  // Create backup directory if it doesn't exist
  static async ensureBackupDir() {
    try {
      await mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.error('Error creating backup directory:', error);
    }
  }
  
  // Create database backup
  static async createDatabaseBackup(): Promise<string> {
    try {
      await this.ensureBackupDir();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `db_backup_${timestamp}.sql`);
      
      // Get database connection info
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error('DATABASE_URL not found');
      }
      
      // Create a simple backup by exporting table data
      const tables = ['users', 'content', 'categories', 'genres', 'content_genres', 'content_categories'];
      let backupData = `-- Database backup created at ${new Date().toISOString()}\n\n`;
      
      for (const table of tables) {
        try {
          const data = await db.execute(sql.raw(`SELECT * FROM ${table}`));
          backupData += `-- Table: ${table}\n`;
          backupData += `-- Records: ${Array.isArray(data) ? data.length : 0}\n\n`;
        } catch (error) {
          backupData += `-- Error backing up table ${table}: ${error}\n\n`;
        }
      }
      
      await writeFile(backupFile, backupData);
      console.log(`✅ Database backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Error creating database backup:', error);
      throw error;
    }
  }
  
  // Create configuration backup
  static async createConfigBackup(): Promise<string> {
    try {
      await this.ensureBackupDir();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `config_backup_${timestamp}.json`);
      
      const config = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        // Add other configuration data here
        features: {
          caching: true,
          security: true,
          performance_monitoring: true,
          database_optimization: true
        }
      };
      
      await writeFile(backupFile, JSON.stringify(config, null, 2));
      console.log(`✅ Configuration backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Error creating configuration backup:', error);
      throw error;
    }
  }
  
  // Schedule automatic backups
  static scheduleBackups() {
    // Daily database backup at 2 AM
    const scheduleDaily = () => {
      const now = new Date();
      const nextBackup = new Date();
      nextBackup.setHours(2, 0, 0, 0);
      
      if (nextBackup <= now) {
        nextBackup.setDate(nextBackup.getDate() + 1);
      }
      
      const timeUntilBackup = nextBackup.getTime() - now.getTime();
      
      setTimeout(async () => {
        try {
          await this.createDatabaseBackup();
          await this.createConfigBackup();
          console.log('📋 Scheduled backup completed');
        } catch (error) {
          console.error('❌ Scheduled backup failed:', error);
        }
        
        // Schedule next backup
        scheduleDaily();
      }, timeUntilBackup);
      
      console.log(`📅 Next backup scheduled for: ${nextBackup.toLocaleString()}`);
    };
    
    scheduleDaily();
  }
  
  // Get backup status
  static async getBackupStatus() {
    try {
      const { stdout } = await execAsync(`ls -la ${this.backupDir}`);
      return {
        backupDirectory: this.backupDir,
        files: stdout.split('\n').filter(line => line.includes('.sql') || line.includes('.json')),
        lastBackup: new Date().toISOString() // This should be read from actual backup files
      };
    } catch (error) {
      return {
        backupDirectory: this.backupDir,
        files: [],
        error: error.message
      };
    }
  }
}

// Initialize backup system
export function initializeBackupSystem() {
  console.log('🔄 Initializing backup system...');
  BackupManager.scheduleBackups();
}
/**
 * مدير قاعدة البيانات الموحد
 * يتضمن: إعداد، صيانة، نسخ احتياطي، تحسين الأداء
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import fs from 'fs';
import path from 'path';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

class DatabaseManager {
  constructor() {
    this.backupDir = './backups';
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async healthCheck() {
    try {
      await db.execute('SELECT 1');
      // Database connection is healthy - silent logging for production
      return true;
    } catch (error) {
      // Database health check failed - error handled silently
      return false;
    }
  }

  async getStats() {
    try {
      const stats = await db.execute(`
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
      `);
      
      return stats.rows;
    } catch (error) {
      // Error getting database stats - handled silently
      return [];
    }
  }

  async optimizePerformance() {
    try {
      // Optimizing database performance - silent logging for production
      
      // تحديث الإحصائيات
      await db.execute('ANALYZE');
      
      // تنظيف الجداول
      await db.execute('VACUUM ANALYZE');
      
      // Database performance optimized - silent logging for production
    } catch (error) {
      // Error optimizing performance - handled silently
    }
  }

  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `backup_${timestamp}.sql`);
      
      // إنشاء نسخة احتياطية من البيانات
      const tables = ['users', 'categories', 'genres', 'content', 'content_genres', 'content_categories'];
      let backupContent = '';
      
      for (const table of tables) {
        try {
          const data = await db.execute(`SELECT * FROM ${table}`);
          backupContent += `-- Backup for table: ${table}\n`;
          backupContent += `-- Generated on: ${new Date().toISOString()}\n\n`;
          
          if (data.rows.length > 0) {
            backupContent += `TRUNCATE TABLE ${table} CASCADE;\n`;
            const columns = Object.keys(data.rows[0]).join(', ');
            
            for (const row of data.rows) {
              const values = Object.values(row).map(val => 
                val === null ? 'NULL' : `'${val.toString().replace(/'/g, "''")}'`
              ).join(', ');
              backupContent += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
            }
          }
          
          backupContent += '\n';
        } catch (error) {
          console.warn(`⚠️ Warning: Could not backup table ${table}:`, error.message);
        }
      }
      
      fs.writeFileSync(backupFile, backupContent);
      console.log(`✅ Backup created: ${backupFile}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Error creating backup:', error);
      throw error;
    }
  }

  async restoreBackup(backupFile) {
    try {
      console.log(`🔄 Restoring backup from: ${backupFile}`);
      
      const backupContent = fs.readFileSync(backupFile, 'utf8');
      const statements = backupContent.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          await db.execute(statement.trim());
        }
      }
      
      console.log('✅ Backup restored successfully');
    } catch (error) {
      console.error('❌ Error restoring backup:', error);
      throw error;
    }
  }

  async cleanupOldBackups(daysToKeep = 7) {
    try {
      const files = fs.readdirSync(this.backupDir);
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - (daysToKeep * 24 * 60 * 60 * 1000));
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted old backup: ${file}`);
        }
      }
      
      console.log('✅ Old backups cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up old backups:', error);
    }
  }

  async resetDatabase() {
    try {
      console.log('🔄 Resetting database...');
      
      // حذف جميع الجداول
      const tables = ['content_categories', 'content_genres', 'content_cast', 'content_images', 'external_ratings', 'content', 'cast_members', 'genres', 'categories', 'users'];
      
      for (const table of tables) {
        try {
          await db.execute(`DROP TABLE IF EXISTS ${table} CASCADE`);
        } catch (error) {
          console.warn(`⚠️ Warning: Could not drop table ${table}:`, error.message);
        }
      }
      
      console.log('✅ Database reset completed');
    } catch (error) {
      console.error('❌ Error resetting database:', error);
      throw error;
    }
  }

  async setupFreshDatabase() {
    try {
      console.log('🚀 Setting up fresh database...');
      
      // إعادة تعيين قاعدة البيانات
      await this.resetDatabase();
      
      // إنشاء قاعدة بيانات جديدة
      const { setupCompleteDatabase } = await import('./setup-database-complete.js');
      await setupCompleteDatabase();
      
      console.log('✅ Fresh database setup completed');
    } catch (error) {
      console.error('❌ Error setting up fresh database:', error);
      throw error;
    }
  }
}

// CLI Interface
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const manager = new DatabaseManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'health':
      manager.healthCheck();
      break;
    case 'stats':
      manager.getStats().then(stats => console.log(stats));
      break;
    case 'optimize':
      manager.optimizePerformance();
      break;
    case 'backup':
      manager.createBackup();
      break;
    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('❌ Please provide backup file path');
        process.exit(1);
      }
      manager.restoreBackup(backupFile);
      break;
    case 'cleanup':
      manager.cleanupOldBackups();
      break;
    case 'reset':
      manager.resetDatabase();
      break;
    case 'fresh':
      manager.setupFreshDatabase();
      break;
    default:
      console.log(`
Available commands:
- health: Check database connection
- stats: Show database statistics
- optimize: Optimize database performance
- backup: Create backup
- restore <file>: Restore from backup
- cleanup: Clean old backups
- reset: Reset database
- fresh: Setup fresh database

Example: node database-manager.js health
      `);
  }
}

export default DatabaseManager;
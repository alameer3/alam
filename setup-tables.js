import { pool } from './server/db.ts';
import fs from 'fs';
import path from 'path';

async function setupTables() {
  console.log('🔧 Setting up database tables...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '0000_yummy_cyclops.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL statements
    const statements = migrationSQL.split('--> statement-breakpoint').filter(s => s.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement.trim());
          console.log('✅ Table created successfully');
        } catch (err) {
          if (err.code === '42P07') {
            console.log('ℹ️ Table already exists, skipping...');
          } else {
            console.error('❌ Error creating table:', err.message);
          }
        }
      }
    }
    
    console.log('✅ All tables setup completed!');
    
  } catch (error) {
    console.error('❌ Failed to setup tables:', error);
    process.exit(1);
  }
}

setupTables().then(() => {
  console.log('🎉 Database setup complete!');
  process.exit(0);
}).catch(err => {
  console.error('💥 Setup failed:', err);
  process.exit(1);
});
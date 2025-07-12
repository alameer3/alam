/**
 * سكريبت إعداد المشروع الموحد
 * يتضمن: إعداد قاعدة البيانات، إنشاء الملفات، التحقق من التبعيات
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class ProjectSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.log = (message, type = 'info') => {
      const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        warning: '\x1b[33m',
        error: '\x1b[31m',
        reset: '\x1b[0m'
      };
      console.log(`${colors[type]}${message}${colors.reset}`);
    };
  }

  async checkEnvironment() {
    this.log('🔍 Checking environment...', 'info');
    
    try {
      // تحقق من Node.js
      const nodeVersion = process.version;
      this.log(`✅ Node.js version: ${nodeVersion}`, 'success');
      
      // تحقق من npm
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`✅ npm version: ${npmVersion}`, 'success');
      
      // تحقق من متغيرات البيئة
      if (!process.env.DATABASE_URL) {
        this.log('⚠️ DATABASE_URL not found', 'warning');
        return false;
      }
      this.log('✅ DATABASE_URL configured', 'success');
      
      return true;
    } catch (error) {
      this.log(`❌ Environment check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async installDependencies() {
    this.log('📦 Installing dependencies...', 'info');
    
    try {
      // تحقق من وجود package.json
      if (!fs.existsSync('package.json')) {
        this.log('❌ package.json not found', 'error');
        return false;
      }
      
      // تحقق من وجود node_modules
      if (!fs.existsSync('node_modules')) {
        this.log('Installing packages...', 'info');
        execSync('npm install', { stdio: 'inherit' });
      }
      
      this.log('✅ Dependencies installed successfully', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Failed to install dependencies: ${error.message}`, 'error');
      return false;
    }
  }

  async setupDatabase() {
    this.log('🗄️ Setting up database...', 'info');
    
    try {
      // استيراد وتشغيل إعداد قاعدة البيانات
      const { setupCompleteDatabase } = await import('./setup-database-complete.js');
      await setupCompleteDatabase();
      
      this.log('✅ Database setup completed', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Database setup failed: ${error.message}`, 'error');
      return false;
    }
  }

  async createRequiredFiles() {
    this.log('📁 Creating required files...', 'info');
    
    try {
      // إنشاء مجلد backups
      const backupsDir = path.join(this.projectRoot, 'backups');
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
        this.log('✅ Created backups directory', 'success');
      }
      
      // إنشاء ملف .env.example إذا لم يكن موجوداً
      const envExamplePath = path.join(this.projectRoot, '.env.example');
      if (!fs.existsSync(envExamplePath)) {
        const envExample = `# Database Configuration
DATABASE_URL=postgres://username:password@localhost:5432/yemenflix

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here

# External APIs (Optional)
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
`;
        fs.writeFileSync(envExamplePath, envExample);
        this.log('✅ Created .env.example file', 'success');
      }
      
      // إنشاء ملف .gitignore المحسن
      const gitignorePath = path.join(this.projectRoot, '.gitignore');
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
.env.test

# Build output
dist/
build/

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Repl.it database
database.sqlite

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Backups
backups/
*.backup

# Temporary files
tmp/
temp/
*.tmp
*.temp

# Uploads
uploads/
attachments/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Replit
.replit
replit.nix
`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      this.log('✅ Updated .gitignore file', 'success');
      
      return true;
    } catch (error) {
      this.log(`❌ Failed to create required files: ${error.message}`, 'error');
      return false;
    }
  }

  async verifySetup() {
    this.log('🔍 Verifying setup...', 'info');
    
    try {
      // تحقق من الملفات المهمة
      const requiredFiles = [
        'package.json',
        'server/index.ts',
        'client/index.html',
        'shared/schema.ts',
        'drizzle.config.ts'
      ];
      
      for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
          this.log(`❌ Required file missing: ${file}`, 'error');
          return false;
        }
      }
      
      this.log('✅ All required files present', 'success');
      
      // تحقق من قاعدة البيانات
      try {
        const DatabaseManager = (await import('./database-manager.js')).default;
        const manager = new DatabaseManager();
        const isHealthy = await manager.healthCheck();
        
        if (!isHealthy) {
          this.log('❌ Database connection failed', 'error');
          return false;
        }
        
        this.log('✅ Database connection verified', 'success');
      } catch (error) {
        this.log(`⚠️ Database verification skipped: ${error.message}`, 'warning');
      }
      
      return true;
    } catch (error) {
      this.log(`❌ Setup verification failed: ${error.message}`, 'error');
      return false;
    }
  }

  async run() {
    this.log('🚀 Starting project setup...', 'info');
    
    try {
      // تشغيل جميع خطوات الإعداد
      const steps = [
        () => this.checkEnvironment(),
        () => this.installDependencies(),
        () => this.createRequiredFiles(),
        () => this.setupDatabase(),
        () => this.verifySetup()
      ];
      
      for (const step of steps) {
        const success = await step();
        if (!success) {
          this.log('❌ Setup failed at one of the steps', 'error');
          return false;
        }
      }
      
      this.log('🎉 Project setup completed successfully!', 'success');
      this.log('You can now run: npm run dev', 'info');
      
      return true;
    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, 'error');
      return false;
    }
  }
}

// تشغيل السكريبت
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const setup = new ProjectSetup();
  setup.run()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export default ProjectSetup;
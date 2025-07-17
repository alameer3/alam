import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, validateInput, checkSecurityStatus } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { dbManager } from "./database/database-manager.js";
import apiRoutes from "./routes/api-routes.js";
import { execSync } from "child_process";
import fs from "fs";
import { createServer } from "http";

const app = express();

// Setup security middleware
app.use(securityHeaders);
app.use(checkSecurityStatus);



// Input sanitization and validation
app.use(validateInput);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Serve static files from serverdata/images or serverdb/images
const serverDataImagesPath = 'serverdata/images';
const serverDbImagesPath = 'serverdb/images';

if (fs.existsSync(serverDataImagesPath)) {
  app.use('/serverdb/images', express.static(serverDataImagesPath));
  console.log('🔧 استخدام صور من serverdata');
} else {
  app.use('/serverdb/images', express.static(serverDbImagesPath));
  console.log('🔧 استخدام صور من serverdb');
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // تشغيل إعداد ملفات العميل أولاً
  if (process.env.NODE_ENV === 'development') {
    console.log("🔧 إعداد ملفات العميل...");
    
    // التأكد من وجود الملفات الأساسية
    try {
      if (fs.existsSync("ensure-client-assets.cjs")) {
        execSync("node ensure-client-assets.cjs", { stdio: "inherit" });
      }
    } catch (error) {
      console.log("تحذير: لم يتم العثور على ensure-client-assets.cjs");
    }
    
    // نسخ الملفات من المصادر الأصلية (إذا كانت متاحة)
    try {
      if (fs.existsSync("copy-all-assets.cjs")) {
        execSync("node copy-all-assets.cjs", { stdio: "inherit" });
      }
    } catch (error) {
      console.log("تحذير: لم يتم العثور على copy-all-assets.cjs");
    }
    
    // إنشاء مكتبات JavaScript مكتملة
    try {
      if (fs.existsSync("create-complete-js-libs.cjs")) {
        execSync("node create-complete-js-libs.cjs", { stdio: "inherit" });
      }
    } catch (error) {
      console.log("تحذير: لم يتم العثور على create-complete-js-libs.cjs");
    }
    
    // تجهيز الملفات النهائية
    try {
      if (fs.existsSync("finalize-assets.cjs")) {
        execSync("node finalize-assets.cjs", { stdio: "inherit" });
      }
    } catch (error) {
      console.log("تحذير: لم يتم العثور على finalize-assets.cjs");
    }
    
    console.log("🔧 تشغيل النظام التلقائي لـ ServerData...");
  }
  try {
    if (fs.existsSync("serverdata/setup.cjs")) {
      execSync("node serverdata/setup.cjs", { stdio: "inherit" });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log("ℹ️ ServerData غير متاح، المتابعة بدونه...");
    }
  }

  // تشغيل النظام التلقائي لـ Replit فقط إذا لم يكن serverdata متاحاً
  if (!fs.existsSync("serverdata/setup.cjs")) {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔧 تشغيل النظام التلقائي لـ Replit...");
    }
    try {
      if (fs.existsSync("replit-auto-setup.cjs")) {
        execSync("node replit-auto-setup.cjs", { stdio: "inherit" });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log("ℹ️ النظام التلقائي غير متاح، المتابعة بدونه...");
      }
    }
  }
  
  // Initialize database
  try {
    await dbManager.initialize();
    console.log("✅ تم تهيئة قاعدة البيانات الجديدة بنجاح");
  } catch (error) {
    console.error("❌ خطأ في تهيئة قاعدة البيانات:", error);
    // Continue with fallback system
  }

  // Add new API routes
  app.use('/api', apiRoutes);
  
  // Register all routes - تم تعطيل routes.ts القديم لتجنب التضارب
  // const server = await registerRoutes(app);
  
  // Create server directly
  const server = createServer(app);

  // Add error handler only (404 handler should be after vite setup)
  app.use(errorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Add 404 handler after vite setup (only for API routes)
  app.use('/api', notFoundHandler);

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

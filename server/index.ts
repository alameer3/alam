import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, validateInput, checkSecurityStatus } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { storage } from "./storage.js";
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

// Serve static assets with correct MIME types
app.use('/style', express.static('client/public/style', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/css', express.static('client/public/css', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('/js', express.static('client/public/js', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/fonts', express.static('client/public/fonts', {
  setHeaders: (res, path) => {
    if (path.endsWith('.woff') || path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (path.endsWith('.eot')) {
      res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
    }
  }
}));

app.use('/images', express.static('client/public/images'));
app.use(express.static('client/public'));

// Serve static files from serverdata/images or serverdb/images
const serverDataImagesPath = 'serverdata/images';
const serverDbImagesPath = 'serverdb/images';

if (fs.existsSync(serverDataImagesPath)) {
  app.use('/serverdb/images', express.static(serverDataImagesPath));
  app.use('/serverdata/images', express.static(serverDataImagesPath));
  console.log('🔧 استخدام صور من serverdata');
} else {
  app.use('/serverdb/images', express.static(serverDbImagesPath));
  app.use('/serverdata/images', express.static(serverDbImagesPath));
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
  // تشغيل إعداد ملفات العميل فقط إذا كانت موجودة
  if (process.env.NODE_ENV === 'development') {
    console.log("🔧 إعداد ملفات العميل...");
    
    // التأكد من وجود الملفات الأساسية
    if (fs.existsSync("ensure-client-assets.cjs")) {
      try {
        execSync("node ensure-client-assets.cjs", { stdio: "inherit" });
      } catch (error) {
        console.log("تحذير: خطأ في تشغيل ensure-client-assets.cjs");
      }
    } else {
      console.log("✅ تم تخطي ensure-client-assets.cjs (غير موجود)");
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
  
  // Initialize storage
  try {
    console.log("✅ تم تهيئة نظام التخزين بنجاح");
  } catch (error) {
    console.error("❌ خطأ في تهيئة نظام التخزين:", error);
  }
  
  // Register all routes
  const server = await registerRoutes(app);
  
  // Server is created by registerRoutes

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

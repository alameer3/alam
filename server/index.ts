import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityHeaders, validateInput, checkSecurityStatus } from "./middleware/security";
// Performance middleware removed - functionality integrated into performance-monitor
import { initializeDatabaseOptimizations } from "./middleware/database";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { performanceMonitor } from "./middleware/performance-monitor";

const app = express();

// Setup security middleware
app.use(securityHeaders);
app.use(checkSecurityStatus);

// Performance monitoring
app.use(performanceMonitor.middleware());

// Input sanitization and validation
app.use(validateInput);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Serve static files from serverdb/images
app.use('/serverdb/images', express.static('serverdb/images'));

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
  // Initialize database optimizations
  await initializeDatabaseOptimizations();
  
  const server = await registerRoutes(app);

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

import express from "express";
import session from "express-session";
import * as path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import * as vite from "./vite";
import { setupRoutes } from "./routes";
import { setupStorage } from "./storage";
import axios from "axios";

// Configuration globale pour axios
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Logging setup
const log = (message: string) => {
  console.log(`${new Date().toLocaleTimeString()} [express] ${message}`);
};

(async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

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

  const server = await setupRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await vite.setupVite(app, server);
  } else {
    vite.serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`Le port ${port} est déjà utilisé. Tentative avec le port ${port + 1}...`);
      setTimeout(() => {
        server.close();
        server.listen({
          port: port + 1,
          host: "0.0.0.0",
          reusePort: true,
        });
      }, 1000);
    } else {
      console.error('Erreur serveur:', err);
    }
  });

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    log(`serving on port ${actualPort}`);
  });
})();
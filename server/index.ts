import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { body, validationResult } from "express-validator";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Security middleware - Helmet for various security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for Vite in dev
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"], // WebSocket for HMR
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for Vite compatibility
  })
);

// Rate limiting to prevent brute force attacks (development-friendly settings)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs (increased for development)
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit login attempts to 20 per 15 minutes (increased for development)
  message: {
    error: "Too many login attempts, please try again later.",
  },
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use(limiter);
app.use("/api/login", authLimiter);
app.use("/api/signup", authLimiter);

// Enable gzip compression for all responses
app.use(
  compression({
    level: 6, // Compression level (0-9)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req: Request, res: Response) => {
      // Don't compress responses with this request header
      if (req.headers["x-no-compression"]) {
        return false;
      }
      // Fallback to standard filter function
      return compression.filter(req, res);
    },
  })
);

// CORS and additional security headers
app.use((req, res, next) => {
  // CORS headers - more restrictive in production
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? ["https://your-domain.com"] // Update with your actual domain
      : ["*"];

  res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Additional security headers (Helmet already provides most)
  res.header("Referrer-Policy", "strict-origin-when-cross-origin");
  res.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // Cache headers for static assets - aggressive caching for performance
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    res.header("Cache-Control", "public, max-age=31536000, immutable"); // 1 year with immutable
    res.header("ETag", `"${Date.now()}"`); // Simple ETag for cache validation
  } else if (req.path.startsWith("/api")) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate, private");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

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

(async () => {
  const server = await registerRoutes(app);

  // Add a simple root route for testing
  app.get("/test", (req, res) => {
    res.json({
      message: "Server is running correctly",
      timestamp: new Date().toISOString(),
    });
  });

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
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5001 to avoid macOS AirTunes on 5000.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5001", 10);

  // Use different listen configuration for development vs production
  const listenOptions =
    process.env.NODE_ENV === "development"
      ? { port, host: "localhost" }
      : { port, host: "0.0.0.0", reusePort: true };

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();

/**
 * Example: Custom IP Headers for Proxy Support
 *
 * This example demonstrates how to configure custom IP header priority
 * for applications running behind proxies like Cloudflare, nginx, or
 * other reverse proxies.
 *
 * By default, logify checks these headers in order:
 *   1. x-forwarded-for
 *   2. x-real-ip
 *   3. x-client-ip
 *
 * When using Cloudflare or other CDNs, you may need different headers
 * like `cf-connecting-ip` to get the real client IP.
 */

import { logger } from "@rasla/logify";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(
    logger({
      console: true,
      includeIp: true,

      // Custom IP headers for Cloudflare (in priority order)
      // The first header found with a value will be used
      ipHeaders: [
        "cf-connecting-ip", // Cloudflare's client IP header
        "x-real-ip", // nginx proxy
        "x-forwarded-for", // Standard proxy header
        "x-client-ip", // Alternative header
      ],

      // Custom log format showing the IP
      format:
        "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms - IP: {ip}",
    })
  )
  .get("/", () => "Hello World!")
  .get("/api/orders", () => ({ orders: [] }))
  .get("/not-found-test", ({ set }) => {
    set.status = 404;
    return { error: "Resource not found" };
  })
  .listen(3000);

console.log(`
🦊 Server running at http://localhost:${app.server?.port}

Test the IP header resolution with:

# Simulate Cloudflare IP header
curl -H "cf-connecting-ip: 203.0.113.50" http://localhost:3000/

# Simulate nginx proxy header
curl -H "x-real-ip: 198.51.100.25" http://localhost:3000/

# Simulate standard forwarded header (comma-separated, first IP is client)
curl -H "x-forwarded-for: 192.0.2.100, 10.0.0.1" http://localhost:3000/

# Test 404 error (should also log IP)
curl -H "cf-connecting-ip: 203.0.113.99" http://localhost:3000/unknown-route

# Multiple headers (cf-connecting-ip has priority)
curl -H "cf-connecting-ip: 203.0.113.50" -H "x-forwarded-for: 10.0.0.1" http://localhost:3000/
`);

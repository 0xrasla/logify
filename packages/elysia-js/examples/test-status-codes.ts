/**
 * Test script to verify status code logging is working correctly.
 * This tests the fix for issue #9: https://github.com/0xrasla/logify/issues/9
 *
 * Run with: bun run examples/test-status-codes.ts
 */

import { Elysia, t } from "elysia";
import { logger } from "../src";

const app = new Elysia()
  .use(logger())
  // 200 - Success
  .get("/", () => "Hello Elysia")

  // 200 - JSON response
  .get("/json", () => ({ message: "Hello JSON" }))

  // 404 - Using status helper
  .get("/not-found", ({ status }) => {
    return status(404, "Resource not found");
  })

  // 500 - Using status helper (the main bug from issue #9)
  .get("/error-status", ({ status }) => {
    return status(500, "Internal server error");
  })

  // 400 - Bad request using status helper
  .get("/bad-request", ({ status }) => {
    return status(400, "Bad request");
  })

  // 201 - Created using status helper
  .post("/create", ({ status }) => {
    return status(201, { id: 1, message: "Created" });
  })

  // Throw error - should trigger onError handler
  .get("/throw-error", () => {
    throw new Error("This is a thrown error");
  })

  // Custom status with response schema (similar to the reported bug)
  .get(
    "/user/:id",
    ({ params: { id }, status }) => {
      if (id === "error") {
        // Simulate a database error
        return status(500, "Failed to get user");
      }
      if (id === "notfound") {
        return status(404, "User not found");
      }
      return { id, name: "Test User" };
    },
    {
      response: {
        200: t.Object({ id: t.String(), name: t.String() }),
        404: t.String(),
        500: t.String(),
      },
    }
  )
  .listen(3456);

console.log(`
🧪 Test server running at http://localhost:3456

Test the following endpoints and verify the logged status codes:

✅ Expected: 200
  curl http://localhost:3456/
  curl http://localhost:3456/json
  curl http://localhost:3456/user/123

✅ Expected: 201
  curl -X POST http://localhost:3456/create

⚠️  Expected: 400
  curl http://localhost:3456/bad-request

⚠️  Expected: 404
  curl http://localhost:3456/not-found
  curl http://localhost:3456/user/notfound

❌ Expected: 500 (This was the bug - was incorrectly logging 200)
  curl http://localhost:3456/error-status
  curl http://localhost:3456/user/error

❌ Expected: 500 (thrown error)
  curl http://localhost:3456/throw-error

Press Ctrl+C to stop the server.
`);

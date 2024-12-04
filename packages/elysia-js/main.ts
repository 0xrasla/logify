import { Elysia } from "elysia";
import { logger } from "./src";

const app = new Elysia();

app.use(
  logger({
    file: true,
    filePath: "./logs/app.log",
    includeIp: true,
    level: "info",
    format:
      "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
  })
);

app.get("/", () => {
  for (let i = 0; i < 100000; i++) {
    console.log(i);
  }

  return "Hello World!";
});

app.listen(3000, () => {
  console.log(
    `🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`
  );
});

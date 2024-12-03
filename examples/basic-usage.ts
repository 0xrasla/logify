import { Elysia } from "elysia";
import { easyLogger } from "../src";

// Basic usage with default options
const app = new Elysia()
  .use(easyLogger())
  .get("/", () => "Hello World!")
  .listen(3000);

console.log(
  `🦊 Basic example running at ${app.server?.hostname}:${app.server?.port}`
);

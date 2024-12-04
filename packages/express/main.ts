import Express from "express";
import { logger } from "./src";

const app = Express();
app.use(
  logger({
    console: true,
    file: true,
    filePath: "./logs/app.log",
    includeIp: true,
    level: "info",
    format:
      "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
  })
);
app.get("/", (req, res) => {
  for (let i = 0; i < 100000; i++) {
    console.log(i);
  }

  res.send("Hello World!");
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

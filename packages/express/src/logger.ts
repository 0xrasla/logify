import chalk from "chalk";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { ILogger, LogEntry, LoggerOptions, LogLevel } from "./types";

const LOG_COLORS = {
  debug: chalk.gray,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
} as const;

export class Logger implements ILogger {
  private static readonly DEFAULT_OPTIONS: Required<LoggerOptions> = {
    console: true,
    file: false,
    filePath: "./logs/app.log",
    level: "info",
    skip: [],
    includeIp: false,
    format:
      "[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip} {message}",
  };

  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = { ...Logger.DEFAULT_OPTIONS, ...options };
    this.initializeFileLogger();
  }

  public debug(input: string | Partial<LogEntry>): void {
    this.log("debug", input);
  }

  public info(input: string | Partial<LogEntry>): void {
    this.log("info", input);
  }

  public warn(input: string | Partial<LogEntry>): void {
    this.log("warn", input);
  }

  public error(input: string | Partial<LogEntry>): void {
    this.log("error", input);
  }

  public log(level: LogLevel, input: string | Partial<LogEntry>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, input);
    const formattedMessage = this.formatLogEntry(entry);

    if (this.options.console) {
      const colorize = LOG_COLORS[level] || chalk.white;
      console.log(colorize(formattedMessage));
    }

    if (this.options.file) {
      this.writeToFile(formattedMessage);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const configuredLevel = levels.indexOf(this.options.level || "info");
    const currentLevel = levels.indexOf(level);
    return currentLevel >= configuredLevel;
  }

  private createLogEntry(
    level: LogLevel,
    input: string | Partial<LogEntry>
  ): LogEntry {
    const timestamp = new Date();

    if (typeof input === "string") {
      return {
        timestamp,
        level,
        method: "",
        path: "",
        statusCode: 0,
        duration: 0,
        message: input,
      };
    }

    return {
      timestamp,
      level,
      method: input.method || "",
      path: input.path || "",
      statusCode: input.statusCode || 0,
      duration: input.duration || 0,
      message: input.message || "",
      ip: input.ip,
    };
  }

  private formatLogEntry(entry: LogEntry): string {
    const format = this.options.format || Logger.DEFAULT_OPTIONS.format;
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    const method = (entry.method || "").toUpperCase().padEnd(7);
    const path = entry.path || "-";
    const statusCode = entry.statusCode ? `${entry.statusCode}` : "";
    const duration = entry.duration ? `${entry.duration}` : "";
    const message = entry.message || "";
    const ip = entry.ip && this.options.includeIp ? ` from ${entry.ip}` : "";

    return format!
      .replace("{timestamp}", timestamp)
      .replace("{level}", level)
      .replace("{method}", method)
      .replace("{path}", path)
      .replace("{statusCode}", statusCode)
      .replace("{duration}", duration)
      .replace("{message}", message)
      .replace("{ip}", ip)
      .trim();
  }

  private writeToFile(message: string): void {
    if (this.options.file && this.options.filePath) {
      try {
        appendFileSync(this.options.filePath, message + "\n");
      } catch (error) {
        console.error("Failed to write to log file:", error);
      }
    }
  }

  private initializeFileLogger(): void {
    if (this.options.file && this.options.filePath) {
      try {
        const dir = dirname(this.options.filePath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
      } catch (error) {
        console.error("Failed to initialize log directory:", error);
      }
    }
  }
}

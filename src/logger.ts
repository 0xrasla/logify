import chalk from "chalk";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { ILogger, LogEntry, LoggerOptions, LogLevel } from "./types";

export class Logger implements ILogger {
  private options: LoggerOptions;
  private static readonly DEFAULT_OPTIONS: LoggerOptions = {
    console: true,
    file: false,
    level: "info",
    format:
      "[{timestamp}] {level} {method} {path} {statusCode} {duration}ms{ip}",
    includeIp: false,
  };

  private readonly levelColors = {
    debug: chalk.gray,
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
  };

  constructor(options: LoggerOptions = {}) {
    this.options = { ...Logger.DEFAULT_OPTIONS, ...options };
    this.initializeFileLogger();
  }

  private initializeFileLogger(): void {
    if (this.options.file && this.options.filePath) {
      const dir = dirname(this.options.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const configuredLevel = levels.indexOf(this.options.level || "info");
    const currentLevel = levels.indexOf(level);
    return currentLevel >= configuredLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    let format = this.options.format || Logger.DEFAULT_OPTIONS.format || "";

    return format
      .replace("{timestamp}", entry.timestamp.toISOString())
      .replace("{level}", entry.level.toUpperCase().padEnd(5))
      .replace("{method}", entry.method)
      .replace("{path}", entry.path)
      .replace("{statusCode}", entry.statusCode.toString())
      .replace("{duration}", entry.duration.toString())
      .replace("{message}", entry.message || "")
      .replace(
        "{ip}",
        entry.ip && this.options.includeIp ? ` from ${entry.ip}` : ""
      );
  }

  private createLogEntry(
    level: LogLevel,
    message: string | Partial<LogEntry>
  ): LogEntry {
    if (typeof message === "string") {
      return {
        timestamp: new Date(),
        level,
        method: "LOG",
        path: "-",
        statusCode: 0,
        duration: 0,
        message,
      };
    }

    return {
      timestamp: message.timestamp || new Date(),
      level: message.level || level,
      method: message.method || "LOG",
      path: message.path || "-",
      statusCode: message.statusCode || 0,
      duration: message.duration || 0,
      message: message.message,
      ip: message.ip,
    };
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

  public log(level: LogLevel, message: string | Partial<LogEntry>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message);
    const formattedMessage = this.formatLogEntry(entry);

    if (this.options.console) {
      const colorize = this.levelColors[level];
      console.log(colorize(formattedMessage));
    }

    if (this.options.file) {
      this.writeToFile(formattedMessage);
    }
  }

  public debug(message: string | Partial<LogEntry>): void {
    this.log("debug", message);
  }

  public info(message: string | Partial<LogEntry>): void {
    this.log("info", message);
  }

  public warn(message: string | Partial<LogEntry>): void {
    this.log("warn", message);
  }

  public error(message: string | Partial<LogEntry>): void {
    this.log("error", message);
  }
}

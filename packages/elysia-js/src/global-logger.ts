import { Logger } from "./logger";
import { ILogger, LoggerOptions } from "./types";

/**
 * Global logger instance that can be accessed from anywhere in the application
 */
let globalLogger: ILogger;

/**
 * Initialize the global logger with the provided options
 *
 * @param options Logger configuration options
 * @returns The configured logger instance
 */
export function initializeLogger(options: LoggerOptions = {}): ILogger {
  globalLogger = new Logger(options);
  return globalLogger;
}

/**
 * Get the global logger instance
 * If the logger hasn't been initialized, it will be created with default options
 *
 * @returns The global logger instance
 */
export function getLogger(): ILogger {
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}

/**
 * Global debug log method
 * @param input Log message or log entry
 */
export function debug(
  input: string | Partial<Parameters<ILogger["debug"]>[0]>,
): void {
  getLogger().debug(input);
}

/**
 * Global info log method
 * @param input Log message or log entry
 */
export function info(
  input: string | Partial<Parameters<ILogger["info"]>[0]>,
): void {
  getLogger().info(input);
}

/**
 * Global warn log method
 * @param input Log message or log entry
 */
export function warn(
  input: string | Partial<Parameters<ILogger["warn"]>[0]>,
): void {
  getLogger().warn(input);
}

/**
 * Global error log method
 * @param input Log message or log entry
 */
export function error(
  input: string | Partial<Parameters<ILogger["error"]>[0]>,
): void {
  getLogger().error(input);
}

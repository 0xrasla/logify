export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  message: string;
  ip?: string;
}

export interface LoggerOptions {
  /** Enable console logging (default: true) */
  console?: boolean;
  /** Enable file logging (default: false) */
  file?: boolean;
  /** File path for logging (required if file is true) */
  filePath?: string;
  /** Log level (default: "info") */
  level?: LogLevel;
  /** Paths to skip from logging */
  skip?: string[];
  /** Include IP address in logs (default: false) */
  includeIp?: boolean;
  /** Custom log format */
  format?: string;
}

export interface ILogger {
  /** Log a debug message */
  debug(input: string | Partial<LogEntry>): void;
  /** Log an info message */
  info(input: string | Partial<LogEntry>): void;
  /** Log a warning message */
  warn(input: string | Partial<LogEntry>): void;
  /** Log an error message */
  error(input: string | Partial<LogEntry>): void;
  /** Log a message with a specific level */
  log(level: LogLevel, input: string | Partial<LogEntry>): void;
}

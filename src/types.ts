export interface LoggerOptions {
  console?: boolean;
  file?: boolean;
  filePath?: string;
  level?: LogLevel;
  format?: string;
  skip?: string[];
  includeIp?: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  message?: string;
  ip?: string;
}

export interface ILogger {
  debug(message: string | Partial<LogEntry>): void;
  info(message: string | Partial<LogEntry>): void;
  warn(message: string | Partial<LogEntry>): void;
  error(message: string | Partial<LogEntry>): void;
  log(level: LogLevel, message: string | Partial<LogEntry>): void;
}

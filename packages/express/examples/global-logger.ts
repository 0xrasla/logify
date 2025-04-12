import express from 'express';
import {
    debug,
    error,
    info,
    initializeLogger,
    logger,
    warn
} from '../src';

// Initialize the global logger with custom options
initializeLogger({
  level: 'debug', // Set minimum log level to debug to see all logs
  console: true,
  file: true,
  filePath: './logs/app.log',
  includeIp: true,
  format: '[{timestamp}] {level} - {message} - {method} {path}{ip}'
});

// Now the global logger is configured and can be used anywhere in the app

const app = express();

// Use the logger middleware (uses the global logger instance)
app.use(logger());

// Example routes demonstrating different log levels
app.get('/', (req, res) => {
  // Using global logger functions directly in route handlers
  debug('Processing root route request');
  info('Root endpoint accessed');
  res.send('Hello World!');
});

app.get('/debug', (req, res) => {
  debug('This is a debug message');
  res.send('Check your console for the debug message');
});

app.get('/info', (req, res) => {
  info('This is an info message');
  res.send('Check your console for the info message');
});

app.get('/warn', (req, res) => {
  warn('This is a warning message');
  res.send('Check your console for the warning message');
});

app.get('/error', (req, res) => {
  error('This is an error message');
  res.send('Check your console for the error message');
});

// Route with error
app.get('/throw-error', (req, res, next) => {
  error('About to throw an error');
  next(new Error('Something went wrong'));
});

// Performance monitoring example
app.get('/performance', (req, res) => {
  debug('Starting intensive operation');
  
  // Log before the intensive operation
  info('Starting intensive calculation');
  
  // Simulate an intensive operation
  const start = Date.now();
  for (let i = 0; i < 1000000; i++) {
    // Heavy computation simulation
    Math.sqrt(i);
  }
  const duration = Date.now() - start;
  
  // Log after the intensive operation with timing
  warn(`Intensive operation completed in ${duration}ms - performance may be affected`);
  
  res.send(`Intensive operation completed in ${duration}ms`);
});

// Service implementation using the global logger
function userService() {
  debug('User service initialized');
  
  return {
    getUser(id: string) {
      info(`Getting user with ID: ${id}`);
      return { id, name: 'Test User' };
    },
    createUser(data: any) {
      if (!data.email) {
        warn('Creating user without email');
      }
      return { created: true, id: 'new-id' };
    },
    deleteUser(id: string) {
      error(`User deletion requested: ${id}`);
      return { deleted: true };
    }
  };
}

// Routes using the service
app.get('/users/:id', (req, res) => {
  const service = userService();
  const user = service.getUser(req.params.id);
  res.json(user);
});

app.post('/users', express.json(), (req, res) => {
  const service = userService();
  const result = service.createUser(req.body);
  res.json(result);
});

app.delete('/users/:id', (req, res) => {
  const service = userService();
  const result = service.deleteUser(req.params.id);
  res.json(result);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error(`Error in request: ${err.message}`);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  info(`Server started at http://localhost:${PORT}`);
});
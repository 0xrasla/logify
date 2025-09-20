import express from 'express';
import { info, initializeLogger, logger } from '../src';

// Configure global logger for application/domain logs
initializeLogger({
  level: 'info',
  format: '[{timestamp}] {level}: {message}'
});

const app = express();

// HTTP middleware uses its own logger instance (different format)
app.use(logger({
  format: '[{timestamp}] {level} {method} {path} {statusCode} | {duration}ms',
  level: 'info'
}));

app.get('/', (req, res) => {
  info('🚀 Express server started'); // Global format
  res.json({ status: 'ok' });
});

app.get('/users', (req, res) => {
  info('Fetching users (business log)');
  res.json([{ id: 1, name: 'Alice' }]);
});

app.listen(3000, () => {
  console.log('Separate HTTP vs Global logger example running on :3000');
});

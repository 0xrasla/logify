import express from 'express';
import { logger } from '../src';

const app = express();

// Use logger middleware with custom configuration
app.use(logger({
  console: true,
  file: true,
  filePath: './logs/app.log',
  includeIp: true,
  format: '[{timestamp}] {level} [{method}] {path} - {statusCode} {duration}ms{ip}',
}));

// Basic routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Async route with delay
app.get('/slow', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.send('Slow response');
});

// Route with error
app.get('/error', (req, res) => {
  throw new Error('Something went wrong');
});

// Route with params
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// POST route
app.post('/users', express.json(), (req, res) => {
  res.json({ created: true, body: req.body });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

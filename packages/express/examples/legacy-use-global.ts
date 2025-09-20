import express, { Request, Response } from 'express';
import { info, logger } from '../src';

// Legacy / unified mode: middleware configures & uses the global logger (useGlobal: true)

const app = express();

app.use(logger({
  useGlobal: true,
  format: '[{timestamp}] {level} {method} {path} {statusCode} {duration}ms :: {message}',
  level: 'debug'
}));

app.get('/', (req: Request, res: Response) => {
  info('This log shares the same format as HTTP logs');
  res.json({ legacy: true });
});

app.listen(3000, () => {
  console.log('Legacy unified logger example running on :3000');
});

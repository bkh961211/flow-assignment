import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDb } from './lib/db';
import { seedFixedExtensions } from './lib/fixedExtensions';
import fixedRoutes from './routes/fixedRoutes';
import customRoutes from './routes/customRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/fixed', fixedRoutes);
app.use('/api/custom', customRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(400).json({ error: message });
});

async function start() {
  await initDb();
  await seedFixedExtensions();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

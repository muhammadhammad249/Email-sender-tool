import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { getErrorMessage } from './utils/errors';

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaigns.routes';
import emailAccountRoutes from './routes/email-accounts.routes';
import leadRoutes from './routes/leads.routes';

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Email Sender Backend is running' });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/email-accounts', emailAccountRoutes);
app.use('/api/leads', leadRoutes);

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global JSON Error Handler ────────────────────────────────────────────────
// MUST have 4 parameters for Express to treat it as an error handler.
// This ensures ALL errors (sync and async via next(err)) return JSON, never HTML.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error Handler]', err?.message || err);
  const status: number = typeof err?.status === 'number' ? err.status
    : typeof err?.statusCode === 'number' ? err.statusCode
    : 500;
  const message: string = getErrorMessage(err, 'Internal server error');
  res.status(status).json({ message });
});

export default app;
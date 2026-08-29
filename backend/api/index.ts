// Vercel Serverless Function entrypoint for the Express backend
// This file imports the configured Express app and exports it for Vercel.
// Local development continues to use backend/src/server.ts (which calls app.listen())
import app from '../src/app';

export default app;
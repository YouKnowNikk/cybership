import express from 'express';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { orderRouter } from './Routers/orderRoutes';
import cors from 'cors';
import { connectToDatabase, disconnectDatabase } from './config/prisma';

const t = initTRPC.create();

const appRouter = t.router({
  order: orderRouter,
});

const app = express();
app.use(cors());

// ✅ Ensure JSON parsing middleware is applied **before** tRPC
app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({ router: appRouter })
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('⏳ Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await disconnectDatabase();
  process.exit(0);
});

startServer();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async () => {
  try {
    console.log('Connecting to the database...');
    await prisma.$connect();
    console.log(' Database connected successfully.');
  } catch (error) {
    console.error(' Database connection failed:', error);
    process.exit(1); 
  }
};

export const disconnectDatabase = async () => {
  console.log(' Closing database connection...');
  await prisma.$disconnect();
  console.log(' Database disconnected. Exiting process.');
};

export default prisma;

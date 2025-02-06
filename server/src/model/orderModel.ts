import prisma from '../config/prisma';

export const getAllOrders = async (page: number, limit: number) => {
  return prisma.order.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { orderLineItems: true }, // Include order line items in the response
  });
};

export const createOrder = async (
  customerName: string,
  customerAddress: string,
  fulfillmentStatus: "PENDING" | "SHIPPED" | "DELIVERED",
  orderLineItems: { productId: number; quantity: number; price: number }[]
) => {
  return prisma.order.create({
    data: {
      customerName,
      customerAddress,
      fulfillmentStatus,
      orderLineItems: {
        create: orderLineItems, // Create related order line items
      },
    },
    include: { orderLineItems: true }, // Return order with its items
  });
};

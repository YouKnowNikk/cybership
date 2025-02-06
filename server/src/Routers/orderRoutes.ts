import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { fetchOrders, addOrder } from '../controllers/orderControllers';

const t = initTRPC.create();

export const orderRouter = t.router({
  getOrders: t.procedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(fetchOrders),

  createOrder: t.procedure
    .input(
      z.object({
        customerName: z.string(),
        customerAddress: z.string(),
        fulfillmentStatus: z.enum(["PENDING", "SHIPPED", "DELIVERED"]),
        orderLineItems: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
      })
    )
    .mutation(addOrder),
});

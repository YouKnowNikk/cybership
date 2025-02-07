import { TRPCError } from '@trpc/server';
import { getAllOrders, createOrder } from '../model/orderModel';

export const fetchOrders = async ({ input }: { input: { page: number; limit: number } }) => {
  try {
    return await getAllOrders(input.page, input.limit);
  } catch (error) {
    console.log("Error fetching orders:", error);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error fetching orders' });
  }
};

export const addOrder = async ({ input }: { 
  input: { 
    customerName: string; 
    customerAddress: string; 
    fulfillmentStatus: "PENDING" | "SHIPPED" | "DELIVERED";
    orderLineItems: { productId: number; quantity: number; price: number }[];
  } 
}) => {
  try {
    return await createOrder(
      input.customerName,
      input.customerAddress,
      input.fulfillmentStatus,
      input.orderLineItems
    );
  } catch (error) {
    console.error("Error creating order:", error);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error creating order' });
  }
};

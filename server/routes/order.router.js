import { Router } from 'express';
import { getAllOrders, getOrdersCountByUserId, getUserOrders, placeOrder,  updateOrderStatus } from '../controllers/order.controllers.js';

const orderRouter = Router()

orderRouter.get('/allOrders', getAllOrders);
orderRouter.get('/count/:encryptedUserId', getOrdersCountByUserId);
orderRouter.get('/getUserOrders/:encryptedUserId', getUserOrders);

orderRouter.put('/update/:orderId', updateOrderStatus);

orderRouter.post('/place-order', placeOrder)

export default orderRouter;


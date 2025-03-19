import { Router } from 'express';
import { addProductPrice, getBuyerProduct, getProductPrice, getSellerProducts, storeShareCode } from '../controllers/seller.controllers.js';

const sellerRouter = Router()

sellerRouter.post('/save-profit', addProductPrice);
sellerRouter.get('/get-profit', getProductPrice);
sellerRouter.post('/store-share-code', storeShareCode);
sellerRouter.get('/buyerproduct/:share_code', getBuyerProduct);
sellerRouter.get('/products/get/:id', getSellerProducts);

export default sellerRouter;

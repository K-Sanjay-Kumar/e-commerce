import multer from "multer";
import { Router } from 'express';
import { addProduct, deleteProduct, getLowStockCount, getProducts, getProductsById, getProductsCount, getRevenue, getTopSellingCount, updateProducts } from '../controllers/product.controllers.js';


const productRouter = Router()

// Use memory storage to store file buffers instead of saving locally
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.post('/add', upload.array('images', 5), addProduct);
productRouter.get('/get', getProducts);
productRouter.get('/get/:id', getProductsById);
productRouter.get('/total-products-count', getProductsCount);
productRouter.get('/top-selling-count', getTopSellingCount);
productRouter.get('/low-stock-count', getLowStockCount);
productRouter.get('/total-revenue', getRevenue);

productRouter.put('/update/:id', upload.array("images"), updateProducts);
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;

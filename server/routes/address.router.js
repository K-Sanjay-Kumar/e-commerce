import { Router } from 'express';
import { addAddress, deleteAddress, getAddressByUserId, updateAddress } from '../controllers/address.controllers.js';

const addressRouter = Router()

addressRouter.post('/add', addAddress);
addressRouter.get('/get/:encryptedUserId', getAddressByUserId);
addressRouter.delete('/deleteAddress', deleteAddress);
addressRouter.put('/update', updateAddress);

export default addressRouter;

import { Router } from 'express';
import { DirectLogin, getUsers, OTPLogin, VerifyOTP } from '../controllers/user.controllers.js';

const userRouter = Router()

userRouter.post('/register', DirectLogin);
userRouter.post('/SendOTP', OTPLogin);
userRouter.post('/VerifyOTP', VerifyOTP);
userRouter.get('/usersList', getUsers);

export default userRouter;

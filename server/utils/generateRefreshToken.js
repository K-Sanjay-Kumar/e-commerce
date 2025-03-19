import UserModel from "../models/user.model";
import jwt from 'jsonwebtoken'

const generateRefreshToken = async (Userid) => {
    const token = await jwt.sign(
        {id : Userid},
        process.env.SECRET_KEY_REFRESH_TOKEN,
        {expiresIn: '7d'}
    )

    const updateRefreshToken = await UserModel.updateOne({ _id: Userid }, { refreshToken: token });

    return token;
}

export default generateRefreshToken;
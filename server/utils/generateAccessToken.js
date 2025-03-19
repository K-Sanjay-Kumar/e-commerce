import jwt from 'jsonwebtoken'

const generateAccessToken = async(Userid) => {
    const token = await jwt.sign(
        {id : Userid},
        process.env.SECRET_KEY_ACCESS_TOKEN,
        {expiresIn: '1d'}
    )
    return token;
}

export default generateAccessToken;

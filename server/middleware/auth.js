import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.access_token || req?.headers?.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = await jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        if(!decode){
            return res.status(401).json({success : false, message: "Unauthorized" });
        }

        req.userId = decode.id;
        next();

    } catch(error){
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default auth;
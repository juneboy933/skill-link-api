import User from '../models/user.js';
import { verifyAccessToken } from '../utils/token.js';

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}
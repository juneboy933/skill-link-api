import User from '../models/user.js';
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from '../utils/token.js';

export const refreshToken = async (req, res) => {
    try{
        const { token } = req.body;
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }
        // Verify the token
        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        } catch (err) {
            return res.status(403).json({
            success: false,
            message: 'Invalid or expired refresh token',
            });
        }
    
        // Find the user
        const user = await User.findById(decoded.id);
        if(!user || user.refreshToken !== token){
            return res.status(401).json({
                success: false,
                message: 'Refresh token not recognized. Please login again'
            });
        }
    
        // generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
    
        // save new generated token in our DB
        user.refreshToken = newRefreshToken;
        await user.save();
    
        return res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })
    } catch(error){
        console.error('Error refreshing the token:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server errror'
        });
    }
}
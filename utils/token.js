import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    try {
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min'});
        return token;
    } catch (error) {
        console.error('Error generating access token');
    }
}

export const generateRefreshToken = (user) => {
    try {
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'});
        return token;
    } catch (error) {
        console.error('Error generating refresh token');
    }
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
}
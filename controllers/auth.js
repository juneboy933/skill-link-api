import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // validation
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    // Register logic
    try {
        // Check if the user already exists
        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({
                success: false,
                message: 'User already exists.'
            });
        }
        // Hash the password from the user
        const hashedPassword = await bcrypt.hash(password, 12);

        // create a new user
        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
        });

        // save our user to the database
        const savedUser = await newUser.save();
        const { password:_, ...userData } = savedUser.toObject();

        // return the new user 
        return res.status(201).json({
            success: true,
            message: 'User registered succussfully',
            data: userData,
        });
    } catch (error) {
        console.error('Error while registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // validation
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Login logic
    try {
        // Check if the user was registered
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Compare the passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }
        // Get the tokens - access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // save the refresh token to our database
        user.refreshToken = refreshToken;
        const savedUser = await user.save();
        const { password: _, ...userData } = savedUser.toObject();

        // return the logged in user
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            Access_token: accessToken,
            data: userData
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const logout = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        user.refreshToken = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
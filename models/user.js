import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'User name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [ true, 'User email is required'],
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'User password is required'],
        trim: true,
        minLength: [ 6, 'Password must be 6 characters long']
    },
    role: {
        type: String,
        enum: ['learner', 'mentor', 'admin'],
        default: 'learner'
    },
    bio: {
        type: String,
        trim: true,
    },
    skills: [
        {
            type: String,
            trim: true,
        }
    ],
    ratings: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
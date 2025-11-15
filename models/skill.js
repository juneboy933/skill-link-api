import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [ true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [ true, 'Description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [ true, 'Price per hour is required' ],
        min: [ 0, 'Price cannot be negative']
    },
    category: [
        {
            type: String,
            trim: true
        }
    ],
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'Mentor is required']
    }
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
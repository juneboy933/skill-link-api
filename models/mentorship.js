import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema({
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    status: {
        type: String,
        enum: [ 'pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    message: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

export default MentorshipRequest;
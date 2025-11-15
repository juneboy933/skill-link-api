import mongoose from "mongoose";
import User from "../models/user.js";
import Skill from "../models/skill.js";
import MentorshipRequest from "../models/mentorship.js";

export const createMentorship = async(req, res) => {
    const { learnerID, skillID, message } = req.body;

    // Validation
    if(!learnerID || !skillID){
        return res.status(400).json({
            success: false,
            message: 'Learner and Skill are required'
        });
    }

    try {
        // validate IDs
        if(!mongoose.Types.ObjectId.isValid(learnerID) || !mongoose.Types.ObjectId.isValid(skillID)){
            return res.status(400).json({
                success: false,
                message: 'Invalid IDs provided'
            });
        }
        // find learner
        const learner = await User.findById(learnerID);
        if(!learner || learner.role !== 'learner'){
            return res.status(403).json({
                success: false,
                message: 'Only learners can request mentorship'
            });
        }

        // find skill
        const skill = await Skill.findById(skillID);
        if(!skill){
            return res.status(404).json({
                success: false,
                message: 'skill not found'
            });
        }

        const newRequest = await MentorshipRequest.create({
            learner: learner._id,
            skill: skill._id,
            status: 'pending',
            message: message ? message.trim() : ''
        });

        return res.status(201).json({
            success: true,
            message: 'Mentorship request created successfully',
            newRequest,
        });
    } catch (error) {
        console.error('Error while creating mentorship:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getAllMentorship = async(req, res) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search/ Filter
        const search = req.query.search;
        const filter = search ? {
            $or: [
                { status: {$regex: search, $options: 'i'}},
            ]
        } : {};

        const mentorshipRequests = await MentorshipRequest.find(filter)
            .populate('learner', ' name email')
            .populate('skill', 'title category')
            .sort({ createdAt: -1})
            .limit(limit)
            .skip(skip);

        const totalMentorshipRequests = await MentorshipRequest.countDocuments(filter);
        const totalPages = Math.ceil( totalMentorshipRequests / limit);
        return res.status(200).json({
            success: true,
            total_requests: totalMentorshipRequests,
            pages: totalPages,
            data: mentorshipRequests,
        });
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getMentorship = async(req, res) => {
    const { id } = req.params;

    try {
        // validate ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid mentorship ID format'
            });
        }

        const mentorshipRequest = await MentorshipRequest.findById(id)
            .populate('learner', 'name email')
            .populate('skill', 'title category');
        if(!mentorshipRequest){
            return res.status(404).json({
                success: false,
                message: 'Mentorship request not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: mentorshipRequest,
        });
    } catch (error) {
        console.error('Error fetching mentorship request:', error);
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }
}

export const updateMentorshipRequest = async(req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        // Validate ID provided
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid mentorship request ID format'
            });
        }
        const mentorshipRequestToUpdate = await MentorshipRequest.findByIdAndUpdate(
            id, 
            updatedFields,
            { new: true, runValidators: true},
        )
            .populate('learner', 'name email')
            .populate('skill', 'title category');
        if(!mentorshipRequestToUpdate){
            return res.status(404).json({
                success: false,
                message: 'Mentorship request not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Mentorship request updated successfully',
            data: mentorshipRequestToUpdate
        });
    } catch (error) {
        console.error('Error updating mentorship request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const deleteMentorshipRequest = async(req, res) => {
    const { id } = req.params;

    try {
        // validate the ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid mentorship request ID format'
            });
        }

        const mentorshipRequestToDelete = await MentorshipRequest.findByIdAndDelete(id);
        if(!mentorshipRequestToDelete){
            return res.status(404).json({
                success: false,
                message: 'Mentorship request is not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Mentorship request deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting mentorship request:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
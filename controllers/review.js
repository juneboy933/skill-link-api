import mongoose from "mongoose";
import User from "../models/user.js";
import Skill from "../models/skill.js";
import Review from "../models/review.js"

export const createReview = async(req, res) => {
    const { learnerID, skillID, rating, comment } = req.body;

    // validation 
    if(!learnerID || !skillID || !rating){
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    if(rating < 1 || rating > 5){
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }

    try {
        // Validate IDs
        if(!mongoose.Types.ObjectId.isValid(learnerID) || !mongoose.Types.ObjectId.isValid(skillID)){
            return res.status(400).json({
                success: false,
                message: 'Invalid IDs formmat'
            });
        }

        const learner = await User.findById(learnerID);
        if(!learner || learner.role !== 'learner'){
            return res.status(403).json({
                success: false,
                message: 'Only learners can create reviews'
            });
        }

        const skill = await Skill.findById(skillID);
        if(!skill){
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        const newReview = await Review.create({
            learner: learner._id,
            skill: skill._id,
            rating,
            comment: comment ? comment.trim() : '',
        });

        const populatedReview = await Review.findById(newReview._id)
            .populate('learner', 'name email')
            .populate('skill', 'title category')

        return res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: populatedReview,
        })
    } catch (error) {
        console.error('Error while creating review:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch reviews with pagination and populate learner & skill
        const reviews = await Review.find()
            .populate('learner', 'name email')
            .populate('skill', 'title category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count total reviews for pagination
        const totalReviews = await Review.countDocuments();
        const totalPages = Math.ceil(totalReviews / limit);

        return res.status(200).json({
            success: true,
            totalReviews,
            totalPages,
            currentPage: page,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getReview = async(req, res) => {
    const { id } = req.params;
    try {
        // validate ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID format'
            });
        }   
        const review = await Review.findById(id).populate('learner', 'name email').populate('skill', 'title category');
        if(!review){
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Error fetching this review:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const updateReview = async(req, res) => {
    const { id } = req.params;
    const updatedField = req.body;

    try {
        // Validate ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID format'
            });
        }
        const reviewToUpdate = await Review.findByIdAndUpdate(
            id, 
            updatedField,
            {new: true, runValidators: true}
        )
            .populate('learner', 'name email')
            .populate('skill', 'title category');
        if(!reviewToUpdate){
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Review updated successfullly',
            data: reviewToUpdate
        });
    } catch (error) {
        console.error('Error updating the review:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const deleteReview = async(req, res) => {
    const { id } = req.params;

    try {
        // Validate ID
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID format'
            });
        }
        const reviewToDelete = await Review.findByIdAndDelete(id);
        if(!reviewToDelete){
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
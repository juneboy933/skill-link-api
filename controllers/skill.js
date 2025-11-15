import mongoose from "mongoose";
import Skill from "../models/skill.js";
import User from "../models/user.js";

// Create new skill
export const createSkill = async(req, res) => {
    const { id } = req.params;
    const { title, description, price, category } = req.body;
    // validation
    if(!title || !description || !price || !category){
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if(user.role !== 'mentor'){
            return res.status(403).json({
                success: false,
                message: 'Only mentors can create skills'
            });
        }

        const newSkill = await Skill.create({
            title: title.trim(),
            description: description.trim(),
            price: parseInt(price),
            category: category.trim(),
            mentor: user._id
        })

        return res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            newSkill
        })
    } catch (error) {
        console.error('Error creating a new skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Get all skills 
export const getAllskills = async(req, res) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search/filter
        const search = req.query.search;
        const filter = search ? {
            $or: [
                {title: {$regex: search, $options: 'i'}},
                {category: {$regex: search, $options: 'i'}}
            ]
        } : {}

        const skills = await Skill.find(filter)
            .sort({ createdAt: -1})
            .skip(skip)
            .limit(limit);

        const totalSkills = await Skill.countDocuments(filter);
        const totalPages = Math.ceil(totalSkills / limit);

        return res.status(200).json({
            success: true,
            totalPages,
            totalSkills,
            currentPage: page,
            skills
        })

    } catch (error) {
        console.error('error while fetching skills:', error);
        return res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }
}

// Get skill by ID
export const getSkill = async(req, res) => {
    try{
        const { id } = req.params;

        // validation
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid skill ID format'
            });
        }
       
        const skill = await Skill.findById(id).populate('mentor', 'name email role');
        if(!skill){
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        return res.status(200).json({
            success: true,
            skill
        });
    } catch (err){
        console.error('Error while fetching the skill:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Update skill
export const updateSkill = async(req, res) => {
    const { id } = req.params;
    const updatedFields  = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid skill ID format'
            });
        }
        const skilltoUpdate = await Skill.findByIdAndUpdate(
            id, 
            updatedFields, 
            { new: true, runValidators: true });

        if(!skilltoUpdate){
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Skill updated successfully',
            skilltoUpdate
        });
    } catch (error) {
        console.error('Error while updating the skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Delete skill
export const deleteSkill = async(req, res) => {
    const { id } = req.params;

    try{
        // Validation
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'Invalid skill ID format'
            });
        }
        const skillToDelete = await Skill.findByIdAndDelete(id);
        if(!skillToDelete){
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error){
        console.error('Error while deleting skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
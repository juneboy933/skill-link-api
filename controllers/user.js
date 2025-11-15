import User from '../models/user.js'

// Get all users
export const getUsers = async(req, res) => {  
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search/Filter
        const search = req.query.search;
        const filter = search ? {
            $or: [
                {name: {$regex: search, $options: 'i'} },
                {email: {$regex: search, $options: 'i'} },
            ]
        } : {}

        const users = await User.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers/limit);

        return res.status(200).json({
            success: true,
            Total_users: totalUsers,
            pages: totalPages,
            users
        });
    } catch (error) {
        console.error('Error while fetching users:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getUserById = async(req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const { password:_, ...userData} = user.toObject();
        return res.status(200).json({
            success: true,
            userData
        })
    } catch (err){
        console.error('Error fetching user:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });   
    } catch (error) {
        console.error('Error deleting user');
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
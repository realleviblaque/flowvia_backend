const User = require("../models/user");

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { fullName, bio, profilePicture, skills } = req.body;

        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;
        if (skills) user.skills = skills;
        
        const upatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: upatedUser._id,
                fullName: upatedUser.fullName,
                username: upatedUser.username,
                email: upatedUser.email,
                bio: upatedUser.bio,
                profilePicture: upatedUser.profilePicture,
                skills: upatedUser.skills
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const followUser = async (req, res) => {
    try {
        const targetUserId = req.body.userId;
        const currentUserId = req.user._id;

        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: "Target user not specified"
            });
        }

        if (String(targetUser) === String(currentUser)) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUser);

        if (!targetUser || !currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (isFollowing) {
            currentUser.following.pull(targetUserId);
            targetUser.follwers.pull(currentUserId);

            await currentUser.save();
            await targetUser.save();

            return res.status(200).json({
                success: true,
                message: "User unfollowed successfully"
            });
        }

        currentUser.following.push(targetUserId);
        targetUser.follwers.push(currentUserId);

        await currentUser.save();
        await targetUser.save();
        
        res.status(200).json({
            success: true,
            message: "User followed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUserById,
    updateUserProfile,
    followUser
};
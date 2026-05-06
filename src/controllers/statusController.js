const Project = require('../models/Project');
const Application = require('../models/Application');

const getWorkStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const activeProjects = await Project.find({
            assignedTo: userId,
            status: "taken"
        }).sort({ updatedAt: -1 });

        const appliedJobs = await Application.find({
            applicant: userId,
        })
        .populate("project", "title description projectType status budget deadline")
        .sort({ createdAt: -1 });

        const completedJobs = await Project.find({
            assignedTo: userId,
            status: "completed"
        }).sort({ updatedAt: -1 });

        const pendingRequests = await Application.find({
            applicant: userId,
            status: "pending"
        })
        .populate("project", "title description projectType status budget deadline")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            activeProjects,
            appliedJobs,
            completedJobs,
            pendingRequests
        });
    } catch (error) {
        console.error('Error fetching work status:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
};

const getHiringStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const openProjects = await Project.find({
            owner: userId,
            status: "open"
        }).sort({ createdAt: -1 });

        const inNegotation = await Project.find({
            owner: userId,
            status: "negotiation"
        }).sort({ createdAt: -1 });

        const takenProjects = await Project.find({
            owner: userId,
            status: "taken"
        }).sort({ updatedAt: -1 });

        const completedProjects = await Project.find({
            owner: userId,
            status: "completed"
        }).sort({ updatedAt: -1 });

        const pendingApplications = await Application.find({
            status: "pending",
        })
        .populate({
            path: "project",
            match: { owner: userId },
            select: "title description projectType status budget deadline"
        })
        .populate("applicant", "fullName email username profilePicture skills")
        .sort({ createdAt: -1 });

        const filteredPendingApplications = pendingApplications.filter(
            (application) => application.project !== null
        );

        res.status(200).json({
            success: true,
            hiringStatus: {
                openProjects,
                inNegotation,
                takenProjects,
                completedProjects,
                pendingApplications: filteredPendingApplications
            }
        });
    } catch (error) {
        console.error('Error fetching hiring status:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getWorkStatus,
    getHiringStatus
};
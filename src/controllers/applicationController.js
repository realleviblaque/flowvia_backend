const Application = require("../models/Application");
const Project = require("../models/Project");

const applyToProject = async (req, res) => {
  try {
    const { projectId, message, proposedBudget } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required"
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.projectType !== "open") {
      return res.status(400).json({
        success: false,
        message: "You can only apply to open projects"
      });
    }

    if (String(project.owner) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own project"
      });
    }

    const existingApplication = await Application.findOne({
      project: projectId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project"
      });
    }

    const application = await Application.create({
      project: projectId,
      applicant: req.user._id,
      message,
      proposedBudget
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const acceptApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const application = await Application.findById(applicationId).populate("project");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const project = application.project;

    if (String(project.owner) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to accept this application"
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be accepted"
      });
    }

    application.status = "accepted";
    await application.save();

    project.assignedTo = application.applicant;
    project.status = "taken";
    await project.save();

    await Application.updateMany(
      {
        project: project._id,
        _id: { $ne: application._id }
      },
      { status: "rejected" }
    );

    res.status(200).json({
      success: true,
      message: "Application accepted and project assigned successfully",
      application,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required"
      });
    }

    const application = await Application.findById(applicationId).populate("project");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const project = application.project;

    if (String(project.owner) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reject this application"
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Application is already processed"
      });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application rejected successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("project", "title description projectType status budget deadline")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProjectApplications = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (String(project.owner) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view applications for this project"
      });
    }

    const applications = await Application.find({ project: projectId })
      .populate("applicant", "fullName username email profilePicture skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  applyToProject,
  acceptApplication,
  rejectApplication,
  getMyApplications,
  getProjectApplications
};
const Project = require('../models/Project');

const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            projectType,
            skillsRequired,
            budget,
            deadline,
            isPublic
        } = req.body;

        if (!title || !description || !projectType) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and project type are required'
            });
        }

        const project = await Project.create({
            title,
            description,
            projectType,
            skillsRequired,
            budget,
            deadline,
            isPublic,
            owner: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message:error.message
        });
    }
};
    const getProjectById = async (req, res) => {
        try {
            const project = await Project.findById(req.params.id)
                .populate("owner", "fullName email username profilePicture")
                .populate("assignedTo", "fullName email username profilePicture")
            
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }
            
            res.status(200).json({
                success: true,
                project
            });
        } catch (error) {
            // console.error('Error fetching project:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };

    const updateProject = async (req, res) => {
        try {
            const projectId = req.body.projectId;

            if (!projectId) {
                return res.status(400).json({
                    success: false,
                    message: 'Project ID is required'
                });
            }

            if(String(project.owner) != String(req.user._id)){
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to update this project'
                });
            }

            const {
                title,
                description,
                projectType,
                skillsRequired,
                budget,
                deadline,
                isPublic
            } = req.body;

            if (title) project.title = title;
            if (description) project.description = description;
            if (projectType) project.projectType = projectType;
            if (status) project.status = status;
            if (skillsRequired) project.skillsRequired = skillsRequired;
            if (budget !== undefined) project.budget = budget;
            if (deadline) project.deadline = deadline;
            if (isPublic !== undefined) project.isPublic = isPublic;

            const updatedProject = await project.save();
            res.status(200).json({
                success: true,
                message: 'Project updated successfully',
                project: updatedProject
            });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

        const getAllProjects = async (req, res) => {
            try {
                const projects = await Project.find({isPublic: true})
                .populate("owner", "fullName email username")
                .sort({ createdAt: -1 });

                res.status(200).json({
                    success: true,
                    count: projects.length,
                    projects
                });
            } catch (error) {
                console.error('Error fetching projects:', error);
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }

        const getMyProjects = async (req, res) => {
            try {
                const projects = await Project.find({ owner: req.user._id })
                .populate("owner", "fullName email username")
                .sort({ createdAt: -1 });

                res.status(200).json({
                    success: true,
                    count: projects.length,
                    projects
                });
            } catch (error) {
                console.error('Error fetching my projects:', error);
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    // GET OPEN PROJECTS
const getOpenProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      projectType: "open",
      status: "open"
    })
      .populate("owner", "fullName username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

    const deleteProject = async (req, res) => {
        try {
            const projectId = req.body.projectId;

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

    if (String(project.owner) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this project"
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
  updateProject,
  deleteProject
};
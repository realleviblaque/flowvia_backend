const Bookmark = require("../models/Bookmark");
const Project = require("../models/Project");

const toggleBookmark = async (req, res) => {
  try {
    const { projectId } = req.body;

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

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      project: projectId
    });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);

      return res.status(200).json({
        success: true,
        message: "Project removed from bookmarks"
      });
    }

    await Bookmark.create({
      user: req.user._id,
      project: projectId
    });

    res.status(201).json({
      success: true,
      message: "Project bookmarked successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBookmarkedProjects = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id
    })
      .populate({
        path: "project",
        populate: {
          path: "owner",
          select: "fullName username email profilePicture"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  toggleBookmark,
  getBookmarkedProjects
};
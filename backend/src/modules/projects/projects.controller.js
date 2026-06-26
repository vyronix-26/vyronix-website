/**
 * Projects Controller
 *
 * This controller handles all HTTP requests related to projects.
 * It receives validated request data, handles uploaded image paths,
 * calls the projects service layer, and sends a structured JSON response
 * back to the client.
 *
 * Responsibilities:
 * - Create a new project.
 * - Retrieve all projects with optional query filters.
 * - Retrieve a single project by ID.
 * - Retrieve a single project by slug.
 * - Update an existing project.
 * - Delete an existing project.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the operation completed successfully.
 * - message: describes the result of create, update, or delete operations.
 * - results: shows the number of returned projects when fetching all projects.
 * - data: contains the returned project or projects.
 *
 * Note:
 * Business logic is handled in the service layer.
 * Database operations are handled in the repository layer.
 * Uploaded files are handled by Multer before reaching this controller.
 */

const projectsService = require("./projects.service");

const createProject = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/projects/${req.file.filename}` : null;

    const project = await projectsService.createProject({
      ...req.body,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const result = await projectsService.getAllProjects(req.query);

    res.status(200).json({
      success: true,
      results: result.projects.length,
      data: {
        projects: result.projects,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectsService.getProjectById(req.params.id);

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await projectsService.getProjectBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const imageUrl = req.file
      ? `/uploads/projects/${req.file.filename}`
      : undefined;

    const project = await projectsService.updateProject(req.params.id, {
      ...req.body,
      ...(imageUrl && { imageUrl }),
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectsService.deleteProject(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
};
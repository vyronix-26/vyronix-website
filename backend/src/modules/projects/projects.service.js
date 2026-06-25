/**
 * Projects Service
 *
 * This service contains the business logic for project management.
 * It acts as a bridge between the controllers and the repository layer.
 *
 * Responsibilities:
 * - Handle project-related business operations.
 * - Verify that a project exists before updating or deleting it.
 * - Throw appropriate application errors when a project cannot be found.
 * - Delegate database operations to the repository layer.
 *
 * Available operations:
 * - Create a new project.
 * - Retrieve all projects (with optional filters).
 * - Retrieve a single project by its ID.
 * - Update an existing project.
 * - Delete a project.
 *
 * Note:
 * Database queries are handled by the repository layer.
 * This service focuses only on business rules and validation logic.
 */


const projectsRepository = require("./projects.repository");
const AppError = require("../../utils/AppError");

const createProject = async (projectData) => {
  return projectsRepository.createProject(projectData);
};

const getAllProjects = async (filters) => {
  return projectsRepository.findAllProjects(filters);
};

const getProjectById = async (id) => {
  const project = await projectsRepository.findProjectById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

const updateProject = async (id, projectData) => {
  const existingProject = await projectsRepository.findProjectById(id);

  if (!existingProject) {
    throw new AppError("Project not found", 404);
  }

  return projectsRepository.updateProject(id, projectData);
};

const deleteProject = async (id) => {
  const existingProject = await projectsRepository.findProjectById(id);

  if (!existingProject) {
    throw new AppError("Project not found", 404);
  }

  await projectsRepository.deleteProject(id);
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
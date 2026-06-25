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
const createSlug = require("../../utils/createSlug");

const buildPagination = ({ page, limit, total }) => {
  const currentPage = Number(page);
  const pageSize = Number(limit);
  const totalPages = Math.ceil(total / pageSize);

  return {
    currentPage,
    pageSize,
    totalItems: total,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

const createProject = async (projectData) => {
  const slug = createSlug(projectData.title);

  const existingProject = await projectsRepository.findProjectBySlug(slug);

  if (existingProject) {
    throw new AppError("Project with this title already exists", 409);
  }

  return projectsRepository.createProject({
    ...projectData,
    slug,
  });
};

const getAllProjects = async (filters) => {
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 9);

  const preparedFilters = {
    ...filters,
    page,
    limit,
  };

  const [projects, total] = await Promise.all([
    projectsRepository.findAllProjects(preparedFilters),
    projectsRepository.countProjects(preparedFilters),
  ]);

  return {
    projects,
    pagination: buildPagination({
      page,
      limit,
      total,
    }),
  };
};

const getProjectById = async (id) => {
  const project = await projectsRepository.findProjectById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

const getProjectBySlug = async (slug) => {
  const project = await projectsRepository.findProjectBySlug(slug);

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

  const dataToUpdate = { ...projectData };

  if (projectData.title) {
    const newSlug = createSlug(projectData.title);

    const projectWithSameSlug = await projectsRepository.findProjectBySlug(newSlug);

    if (projectWithSameSlug && projectWithSameSlug.id !== Number(id)) {
      throw new AppError("Project with this title already exists", 409);
    }

    dataToUpdate.slug = newSlug;
  }

  return projectsRepository.updateProject(id, dataToUpdate);
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
  getProjectBySlug,
  updateProject,
  deleteProject,
};
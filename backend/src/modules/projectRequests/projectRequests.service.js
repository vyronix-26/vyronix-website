/**
 * Project Requests Service
 *
 * This service contains the business logic for project request management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Create a new project request for an authenticated client.
 * - Retrieve all project requests for admin users.
 * - Retrieve all project requests submitted by a specific client.
 * - Retrieve a single request by ID for admin users.
 * - Retrieve a single request by ID for the request owner only.
 * - Update request status and admin note.
 * - Delete an existing project request.
 * - Enforce ownership checks for client-specific request access.
 * - Throw application-specific errors when requests are not found or access is denied.
 *
 * Notes:
 * - clientId is taken from the authenticated user and passed from the controller.
 * - Authorization middleware should restrict admin-only operations before reaching this service.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible for business rules and access checks.
 */

const projectRequestsRepository = require("./projectRequests.repository");
const AppError = require("../../utils/AppError");

const createRequest = async (clientId, requestData) => {
  return projectRequestsRepository.createRequest({
    ...requestData,
    clientId,
  });
};

const getAllRequests = async () => {
  return projectRequestsRepository.findAllRequests();
};

const getMyRequests = async (clientId) => {
  return projectRequestsRepository.findRequestsByClientId(clientId);
};

const getRequestByIdForAdmin = async (id) => {
  const request = await projectRequestsRepository.findRequestById(id);

  if (!request) {
    throw new AppError("Project request not found", 404);
  }

  return request;
};

const getMyRequestById = async (clientId, requestId) => {
  const request = await projectRequestsRepository.findRequestById(requestId);

  if (!request) {
    throw new AppError("Project request not found", 404);
  }

  if (request.clientId !== clientId) {
    throw new AppError("You are not allowed to access this request", 403);
  }

  return request;
};

const updateRequestStatus = async (id, statusData) => {
  const request = await projectRequestsRepository.updateRequestStatus(
    id,
    statusData
  );

  if (!request) {
    throw new AppError("Project request not found", 404);
  }

  return request;
};

const deleteRequest = async (id) => {
  const deleted = await projectRequestsRepository.deleteRequest(id);

  if (!deleted) {
    throw new AppError("Project request not found", 404);
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestByIdForAdmin,
  getMyRequestById,
  updateRequestStatus,
  deleteRequest,
};
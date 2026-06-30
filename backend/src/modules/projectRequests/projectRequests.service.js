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
 * - Send notifications to admins when a new project request is created.
 * - Send notifications to clients when their request status is updated.
 * - Throw application-specific errors when requests are not found or access is denied.
 *
 * Notes:
 * - clientId is taken from the authenticated user and passed from the controller.
 * - Authorization middleware should restrict admin-only operations before reaching this service.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible for business rules and access checks.
 */

const projectRequestsRepository = require("./projectRequests.repository");
const notificationsRepository = require("../notifications/notifications.repository");
const {
  NOTIFICATION_TYPES,
} = require("../notifications/notifications.constants");
const AppError = require("../../utils/AppError");

const createRequest = async (clientId, requestData) => {
  const request = await projectRequestsRepository.createRequest({
    ...requestData,
    clientId,
  });

  const adminIds = await notificationsRepository.findUserIdsByRole("ADMIN");

  await notificationsRepository.createNotificationsForUsers({
    userIds: adminIds,
    title: "New Project Request",
    message: "A client submitted a new project request.",
    type: NOTIFICATION_TYPES.PROJECT_REQUEST,
    referenceId: request.id,
  });

  return request;
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
  const updatedRequest = await projectRequestsRepository.updateRequestStatus(
    id,
    statusData
  );

  if (!updatedRequest) {
    throw new AppError("Project request not found", 404);
  }

  await notificationsRepository.createNotification({
    userId: updatedRequest.clientId,
    title: "Project Request Updated",
    message: `Your project request status is now ${updatedRequest.status}.`,
    type: NOTIFICATION_TYPES.PROJECT_REQUEST,
    referenceId: updatedRequest.id,
  });

  return updatedRequest;
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
/**
 * Project Requests Controller
 *
 * This controller handles all HTTP requests related to project requests.
 * It receives validated request data, calls the project requests service layer,
 * and returns structured JSON responses to the client.
 *
 * Responsibilities:
 * - Submit a new project request for the authenticated client.
 * - Retrieve all project requests for admin users.
 * - Retrieve all project requests submitted by the authenticated client.
 * - Retrieve a single request by ID for admin users.
 * - Retrieve a single request by ID for the request owner.
 * - Update project request status and admin note.
 * - Delete an existing project request.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - message: describes the result of create, update, or delete operations.
 * - results: number of returned requests when fetching multiple requests.
 * - data: contains the returned request or requests.
 *
 * Notes:
 * - The authenticated user's id is taken from req.user.id.
 * - Admin-only access should be enforced in the routes using authorization middleware.
 * - Ownership checks for client-specific requests are handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const projectRequestsService = require("./projectRequests.service");

const createRequest = async (req, res, next) => {
  try {
    const request = await projectRequestsService.createRequest(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Project request submitted successfully",
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const requests = await projectRequestsService.getAllRequests();

    res.status(200).json({
      success: true,
      results: requests.length,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await projectRequestsService.getMyRequests(req.user.id);

    res.status(200).json({
      success: true,
      results: requests.length,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

const getRequestByIdForAdmin = async (req, res, next) => {
  try {
    const request = await projectRequestsService.getRequestByIdForAdmin(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

const getMyRequestById = async (req, res, next) => {
  try {
    const request = await projectRequestsService.getMyRequestById(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const normalizedBody = {
      ...req.body,
      adminNote: req.body.adminNote ?? req.body.admin_note ?? null,
    };

    const request = await projectRequestsService.updateRequestStatus(
      req.params.id,
      normalizedBody
    );

    res.status(200).json({
      success: true,
      message: "Project request status updated successfully",
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    await projectRequestsService.deleteRequest(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
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
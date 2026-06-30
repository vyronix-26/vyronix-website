/**
 * Feedback Controller
 *
 * This controller handles all HTTP requests related to client feedback.
 * It receives validated request data, calls the feedback service layer,
 * and returns structured JSON responses.
 *
 * Responsibilities:
 * - Submit new feedback from the authenticated client.
 * - Retrieve all feedback for admin users.
 * - Retrieve featured feedback for public display.
 * - Update the featured status of feedback.
 * - Delete feedback.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - message: describes the result of create, update, or delete operations.
 * - results: number of returned feedback records.
 * - data: contains the returned feedback record or feedback list.
 *
 * Notes:
 * - The authenticated client's ID is taken from req.user.id.
 * - Authorization is handled in the routes using middleware.
 * - Business logic is handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const feedbackService = require("./feedback.service");

const createFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getAllFeedback();

    res.status(200).json({
      success: true,
      results: feedback.length,
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

const getPublicFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getPublicFeedback();

    res.status(200).json({
      success: true,
      results: feedback.length,
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

const updateFeedbackFeatured = async (req, res, next) => {
  try {
    const feedback = await feedbackService.updateFeedbackFeatured(
      req.params.id,
      req.body.isFeatured
    );

    res.status(200).json({
      success: true,
      message: "Feedback featured status updated successfully",
      data: { feedback },
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    await feedbackService.deleteFeedback(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getPublicFeedback,
  updateFeedbackFeatured,
  deleteFeedback,
};
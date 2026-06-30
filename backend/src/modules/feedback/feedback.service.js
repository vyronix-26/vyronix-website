/**
 * Feedback Service
 *
 * This service contains the business logic for feedback management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Create new feedback for the authenticated client.
 * - Retrieve all feedback for admin users.
 * - Retrieve featured feedback for public display.
 * - Update the featured status of feedback.
 * - Delete feedback.
 * - Throw application-specific errors when feedback cannot be found.
 *
 * Notes:
 * - The authenticated client's ID is provided by the authentication middleware.
 * - Only admins should update the featured status or delete feedback.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible only for business rules and validation logic.
 */

const feedbackRepository = require("./feedback.repository");
const AppError = require("../../utils/AppError");

const createFeedback = async (clientId, feedbackData) => {
  return feedbackRepository.createFeedback({
    clientId,
    ...feedbackData,
  });
};

const getAllFeedback = async () => {
  return feedbackRepository.findAllFeedback();
};

const getPublicFeedback = async () => {
  return feedbackRepository.findPublicFeedback();
};

const updateFeedbackFeatured = async (id, isFeatured) => {
  const feedback = await feedbackRepository.updateFeedbackFeatured(
    id,
    isFeatured
  );

  if (!feedback) {
    throw new AppError("Feedback not found", 404);
  }

  return feedback;
};

const deleteFeedback = async (id) => {
  const deleted = await feedbackRepository.deleteFeedback(id);

  if (!deleted) {
    throw new AppError("Feedback not found", 404);
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getPublicFeedback,
  updateFeedbackFeatured,
  deleteFeedback,
};
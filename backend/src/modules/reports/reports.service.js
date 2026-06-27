/**
 * Dashboard Service
 *
 * This service contains the business logic for the admin dashboard.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Retrieve statistics from all dashboard modules.
 * - Execute independent database queries concurrently.
 * - Normalize numeric values returned from the database.
 * - Format the dashboard response into a structured object.
 *
 * Dashboard sections:
 * - Users statistics.
 * - Projects statistics.
 * - Services statistics.
 * - Project requests statistics.
 * - Feedback statistics.
 * - Latest registered users.
 * - Latest project requests.
 *
 * Notes:
 * - Database operations are delegated to the repository layer.
 * - Independent queries are executed using Promise.all() for better performance.
 * - Numeric database values are normalized before being returned.
 */

const reportsRepository = require("./reports.repository");

const normalizeNumber = (value) => Number(value || 0);

const getDashboardReport = async () => {
  const [
    usersStats,
    projectsStats,
    servicesStats,
    requestsStats,
    feedbackStats,
    latestUsers,
    latestProjectRequests,
  ] = await Promise.all([
    reportsRepository.getUsersStats(),
    reportsRepository.getProjectsStats(),
    reportsRepository.getServicesStats(),
    reportsRepository.getProjectRequestsStats(),
    reportsRepository.getFeedbackStats(),
    reportsRepository.getLatestUsers(),
    reportsRepository.getLatestProjectRequests(),
  ]);

  return {
    users: {
      total: normalizeNumber(usersStats.totalUsers),
      clients: normalizeNumber(usersStats.totalClients),
      admins: normalizeNumber(usersStats.totalAdmins),
      active: normalizeNumber(usersStats.activeUsers),
      inactive: normalizeNumber(usersStats.inactiveUsers),
    },

    projects: {
      total: normalizeNumber(projectsStats.totalProjects),
      software: normalizeNumber(projectsStats.softwareProjects),
      uiDesign: normalizeNumber(projectsStats.uiDesignProjects),
      featured: normalizeNumber(projectsStats.featuredProjects),
    },

    services: {
      total: normalizeNumber(servicesStats.totalServices),
      active: normalizeNumber(servicesStats.activeServices),
      inactive: normalizeNumber(servicesStats.inactiveServices),
    },

    projectRequests: {
      total: normalizeNumber(requestsStats.totalRequests),
      pending: normalizeNumber(requestsStats.pendingRequests),
      inReview: normalizeNumber(requestsStats.inReviewRequests),
      accepted: normalizeNumber(requestsStats.acceptedRequests),
      rejected: normalizeNumber(requestsStats.rejectedRequests),
    },

    feedback: {
      total: normalizeNumber(feedbackStats.totalFeedback),
      averageRating: Number(feedbackStats.averageRating || 0),
      featured: normalizeNumber(feedbackStats.featuredFeedback),
    },

    latest: {
      users: latestUsers,
      projectRequests: latestProjectRequests,
    },
  };
};

module.exports = {
  getDashboardReport,
};
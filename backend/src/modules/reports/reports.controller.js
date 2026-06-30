/**
 * Dashboard Controller
 *
 * This controller handles all HTTP requests related to the admin dashboard.
 * It receives requests, calls the dashboard service layer,
 * and returns structured JSON responses.
 *
 * Responsibilities:
 * - Retrieve the complete dashboard report.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - data: contains the complete dashboard report.
 *
 * Notes:
 * - Authorization is handled in the routes using middleware.
 * - Business logic is handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const reportsService = require("./reports.service");

const getDashboardReport = async (req, res, next) => {
  try {
    const report = await reportsService.getDashboardReport();

    res.status(200).json({
      success: true,
      data: {
        report,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardReport,
};
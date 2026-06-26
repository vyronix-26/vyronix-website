/**
 * Services Controller
 *
 * This controller handles all HTTP requests related to services.
 * It receives validated request data, handles uploaded image paths,
 * calls the service layer, and returns structured JSON responses.
 *
 * Responsibilities:
 * - Create a new service.
 * - Retrieve all services.
 * - Retrieve a single service by its ID.
 * - Update an existing service.
 * - Delete an existing service.
 * - Forward errors to the global error handler using next(error).
 *
 * Response format:
 * - success: indicates whether the request completed successfully.
 * - message: describes the result of create, update, or delete operations.
 * - results: number of returned services when fetching all services.
 * - data: contains the returned service or services.
 *
 * Notes:
 * - Uploaded service images are handled by Multer before reaching this controller.
 * - The uploaded image path is converted to imageUrl and passed to the service layer.
 * - Business logic is handled in the service layer.
 * - Database operations are handled in the repository layer.
 */

const servicesService = require("./services.service");

const createService = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/services/${req.file.filename}` : null;

    const service = await servicesService.createService({
      ...req.body,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const services = await servicesService.getAllServices();

    res.status(200).json({
      success: true,
      results: services.length,
      data: { services },
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await servicesService.getServiceById(req.params.id);

    res.status(200).json({
      success: true,
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const imageUrl = req.file
      ? `/uploads/services/${req.file.filename}`
      : undefined;

    const service = await servicesService.updateService(req.params.id, {
      ...req.body,
      ...(imageUrl && { imageUrl }),
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: { service },
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await servicesService.deleteService(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
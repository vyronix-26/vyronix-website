/**
 * Services Service
 *
 * This service contains the business logic for service management.
 * It acts as a bridge between the controller layer and the repository layer.
 *
 * Responsibilities:
 * - Create a new service.
 * - Retrieve all services.
 * - Retrieve a single service by its ID.
 * - Update an existing service.
 * - Delete a service.
 * - Ensure a service image is provided when creating a new service.
 * - Throw application-specific errors when business rules are violated.
 *
 * Notes:
 * - Image upload is handled by Multer before reaching this service.
 * - The controller provides the uploaded image path as imageUrl.
 * - Database operations are delegated to the repository layer.
 * - This service is responsible only for business validation and rules.
 */

const servicesRepository = require("./services.repository");
const AppError = require("../../utils/AppError");

const createService = async (serviceData) => {
  if (!serviceData.imageUrl) {
    throw new AppError("Service image is required", 400);
  }

  return servicesRepository.createService(serviceData);
};

const getAllServices = async () => {
  return servicesRepository.findAllServices();
};

const getServiceById = async (id) => {
  const service = await servicesRepository.findServiceById(id);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

const updateService = async (id, serviceData) => {
  const service = await servicesRepository.updateService(id, serviceData);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

const deleteService = async (id) => {
  const deleted = await servicesRepository.deleteService(id);

  if (!deleted) {
    throw new AppError("Service not found", 404);
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
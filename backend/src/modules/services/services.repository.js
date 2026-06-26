/**
 * Services Repository
 *
 * This file handles all database operations related to services.
 * It communicates directly with the MySQL database using the shared pool
 * connection and returns clean JavaScript objects to the service layer.
 *
 * Responsibilities:
 * - Create a new service record.
 * - Retrieve all services ordered by display order and creation date.
 * - Retrieve a single service by its ID.
 * - Update allowed service fields dynamically.
 * - Delete a service by its ID.
 *
 * Database table:
 * - services
 *
 * Notes:
 * - The repository does not handle business validation.
 * - Validation and existence checks should be handled in the service layer.
 * - Image upload handling should be done before reaching this repository.
 * - This repository maps database snake_case fields to camelCase fields
 *   for cleaner API responses.
 */

const pool = require("../../config/db");

const createService = async (serviceData) => {
  const {
    title,
    description,
    imageUrl,
    isActive = true,
    displayOrder = 0,
  } = serviceData;

  const [result] = await pool.query(
    `
    INSERT INTO services (title, description, image_url, is_active, display_order)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, description, imageUrl, isActive, displayOrder]
  );

  return findServiceById(result.insertId);
};

const findAllServices = async () => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      image_url AS imageUrl,
      is_active AS isActive,
      display_order AS displayOrder,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
    ORDER BY display_order ASC, created_at DESC
    `
  );

  return rows;
};

const findServiceById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      image_url AS imageUrl,
      is_active AS isActive,
      display_order AS displayOrder,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM services
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const updateService = async (id, serviceData) => {
  const fieldsMap = {
    title: "title",
    description: "description",
    imageUrl: "image_url",
    isActive: "is_active",
    displayOrder: "display_order",
  };

  const fields = [];
  const values = [];

  Object.keys(serviceData).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(fieldsMap, key)) {
      fields.push(`${fieldsMap[key]} = ?`);
      values.push(serviceData[key]);
    }
  });

  if (fields.length === 0) {
    return findServiceById(id);
  }

  values.push(id);

  const [result] = await pool.query(
    `
    UPDATE services
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findServiceById(id);
};

const deleteService = async (id) => {
  const [result] = await pool.query(
    `
    DELETE FROM services
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createService,
  findAllServices,
  findServiceById,
  updateService,
  deleteService,
};
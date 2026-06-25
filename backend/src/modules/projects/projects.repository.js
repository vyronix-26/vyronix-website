const pool = require("../../config/db");

const createProject = async (projectData) => {
  const { title, description, imageUrl, githubUrl, liveUrl, type } = projectData;

  const [result] = await pool.query(
    `
    INSERT INTO projects (title, description, image_url, github_url, live_url, type)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [title, description, imageUrl, githubUrl || null, liveUrl || null, type]
  );

  return {
    id: result.insertId,
    title,
    description,
    imageUrl,
    githubUrl: githubUrl || null,
    liveUrl: liveUrl || null,
    type,
  };
};

const findAllProjects = async ({ type }) => {
  let query = `
    SELECT 
      id,
      title,
      description,
      image_url AS imageUrl,
      github_url AS githubUrl,
      live_url AS liveUrl,
      type,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM projects
  `;

  const values = [];

  if (type) {
    query += " WHERE type = ?";
    values.push(type);
  }

  query += " ORDER BY created_at DESC";

  const [rows] = await pool.query(query, values);
  return rows;
};

const findProjectById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      title,
      description,
      image_url AS imageUrl,
      github_url AS githubUrl,
      live_url AS liveUrl,
      type,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM projects
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

const updateProject = async (id, projectData) => {
  const fieldsMap = {
    title: "title",
    description: "description",
    imageUrl: "image_url",
    githubUrl: "github_url",
    liveUrl: "live_url",
    type: "type",
  };

  const fields = [];
  const values = [];

  Object.keys(projectData).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(fieldsMap, key)) {
      fields.push(`${fieldsMap[key]} = ?`);
      values.push(projectData[key] === "" ? null : projectData[key]);
    }
  });

  values.push(id);

  await pool.query(
    `
    UPDATE projects
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  return findProjectById(id);
};

const deleteProject = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM projects WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createProject,
  findAllProjects,
  findProjectById,
  updateProject,
  deleteProject,
};
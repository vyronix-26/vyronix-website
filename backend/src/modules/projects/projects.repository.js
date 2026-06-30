const pool = require("../../config/db");

const createProject = async (projectData) => {
  const {
    title,
    slug,
    description,
    imageUrl,
    githubUrl,
    liveUrl,
    type,
    category,
    isFeatured = false,
  } = projectData;

  const [result] = await pool.query(
    `
    INSERT INTO projects 
    (title, slug, description, image_url, github_url, live_url, type, category, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      title,
      slug,
      description,
      imageUrl,
      githubUrl || null,
      liveUrl || null,
      type,
      category,
      isFeatured,
    ]
  );

  return findProjectById(result.insertId);
};

const findAllProjects = async (filters = {}) => {
  const { type, category, search, featured, sort = "newest", page = 1, limit = 9 } = filters;

  let query = `
    SELECT 
      id,
      title,
      slug,
      description,
      image_url AS imageUrl,
      github_url AS githubUrl,
      live_url AS liveUrl,
      type,
      category,
      is_featured AS isFeatured,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM projects
    WHERE 1 = 1
  `;

  const values = [];

  if (type) {
    query += " AND type = ?";
    values.push(type);
  }

  if (category) {
    query += " AND category = ?";
    values.push(category);
  }

  if (featured !== undefined) {
    query += " AND is_featured = ?";
    values.push(featured === true || featured === "true" ? 1 : 0);
  }

  if (search) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  if (sort === "oldest") {
    query += " ORDER BY created_at ASC";
  } else {
    query += " ORDER BY created_at DESC";
  }

  const offset = (Number(page) - 1) * Number(limit);

  query += " LIMIT ? OFFSET ?";
  values.push(Number(limit), Number(offset));

  const [rows] = await pool.query(query, values);
  return rows;
};

const countProjects = async (filters = {}) => {
  const { type, category, search, featured } = filters;

  let query = `
    SELECT COUNT(*) AS total
    FROM projects
    WHERE 1 = 1
  `;

  const values = [];

  if (type) {
    query += " AND type = ?";
    values.push(type);
  }

  if (category) {
    query += " AND category = ?";
    values.push(category);
  }

  if (featured !== undefined) {
    query += " AND is_featured = ?";
    values.push(featured === true || featured === "true" ? 1 : 0);
  }

  if (search) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await pool.query(query, values);
  return rows[0].total;
};

const findProjectById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      title,
      slug,
      description,
      image_url AS imageUrl,
      github_url AS githubUrl,
      live_url AS liveUrl,
      type,
      category,
      is_featured AS isFeatured,
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

const findProjectBySlug = async (slug) => {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      title,
      slug,
      description,
      image_url AS imageUrl,
      github_url AS githubUrl,
      live_url AS liveUrl,
      type,
      category,
      is_featured AS isFeatured,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM projects
    WHERE slug = ?
    LIMIT 1
    `,
    [slug]
  );

  return rows[0];
};

const updateProject = async (id, projectData) => {
  const fieldsMap = {
    title: "title",
    slug: "slug",
    description: "description",
    imageUrl: "image_url",
    githubUrl: "github_url",
    liveUrl: "live_url",
    type: "type",
    category: "category",
    isFeatured: "is_featured",
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
  const [result] = await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);

  return result.affectedRows > 0;
};

module.exports = {
  createProject,
  findAllProjects,
  countProjects,
  findProjectById,
  findProjectBySlug,
  updateProject,
  deleteProject,
};
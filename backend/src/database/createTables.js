const createUsersTable = require("./tables/createUsersTable");
const createProjectsTable = require("./tables/createProjectsTable");

const createTables = async () => {
  await createUsersTable();
  await createProjectsTable();

  console.log("Tables checked/created successfully");
};

module.exports = createTables;
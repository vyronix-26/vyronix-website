const createUsersTable = require("./tables/createUsersTable");
const createProjectsTable = require("./tables/createProjectsTable");
const createServicesTable = require("./tables/createServicesTable");


const createTables = async () => {
  await createUsersTable();
  await createProjectsTable();
  await createServicesTable();

  console.log("Tables checked/created successfully");
};

module.exports = createTables;
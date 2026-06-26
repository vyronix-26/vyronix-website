const createUsersTable = require("./tables/createUsersTable");
const createProjectsTable = require("./tables/createProjectsTable");
const createServicesTable = require("./tables/createServicesTable");
const createProjectRequestsTable = require("./tables/createProjectRequestsTable");


const createTables = async () => {
  await createUsersTable();
  await createProjectsTable();
  await createServicesTable();
  await createProjectRequestsTable();
  
  console.log("Tables checked/created successfully");
};

module.exports = createTables;
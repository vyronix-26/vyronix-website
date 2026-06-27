const createUsersTable = require("./tables/createUsersTable");
const createProjectsTable = require("./tables/createProjectsTable");
const createServicesTable = require("./tables/createServicesTable");
const createProjectRequestsTable = require("./tables/createProjectRequestsTable");
const createNotificationsTable = require("./tables/createNotificationsTable");
const createFeedbackTable = require("./tables/createFeedbackTable");



const createTables = async () => {
  await createUsersTable();
  await createProjectsTable();
  await createServicesTable();
  await createProjectRequestsTable();
  await createNotificationsTable();
  await createFeedbackTable();

  console.log("Tables checked/created successfully");
};

module.exports = createTables;
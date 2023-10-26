import Database from "./databaseController.js";

(async () => {
    await Database.startDatabase();
    await Database.testConnection();
})();
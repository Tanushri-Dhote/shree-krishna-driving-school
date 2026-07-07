const {
    postMaintenanceHandler,
    getMaintenancesHandler,
    getMaintenanceByIdHandler,
    patchMaintenanceHandler,
    deleteMaintenanceHandler,
} = require("./maintenance.controller");

async function maintenanceRoutes(fastify) {
    fastify.post("/api/maintenance", postMaintenanceHandler);
    fastify.get("/api/maintenance", getMaintenancesHandler);
    fastify.get("/api/maintenance/:id", getMaintenanceByIdHandler);
    fastify.patch("/api/maintenance/:id", patchMaintenanceHandler);
    fastify.delete("/api/maintenance/:id", deleteMaintenanceHandler);
}

module.exports = { maintenanceRoutes };

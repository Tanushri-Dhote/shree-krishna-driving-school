const {
    postLicenceHandler,
    getLicencesHandler,
    getLicenceByIdHandler,
    patchLicenceStatusHandler,
} = require("./licence.controller");

async function licenceRoutes(fastify) {
    fastify.post("/api/licences", postLicenceHandler);
    fastify.get("/api/licences", getLicencesHandler);
    fastify.get("/api/licences/:id", getLicenceByIdHandler);
    fastify.patch("/api/licences/:id/status", patchLicenceStatusHandler);
}

module.exports = { licenceRoutes };

const {
    postInsuranceHandler,
    getInsurancesHandler,
    getInsuranceByIdHandler,
    patchInsuranceStatusHandler,
} = require("./insurance.controller");

async function insuranceRoutes(fastify) {
    fastify.post("/api/insurances", postInsuranceHandler);
    fastify.get("/api/insurances", getInsurancesHandler);
    fastify.get("/api/insurances/:id", getInsuranceByIdHandler);
    fastify.patch("/api/insurances/:id/status", patchInsuranceStatusHandler);
}

module.exports = { insuranceRoutes };

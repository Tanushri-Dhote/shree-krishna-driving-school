const {
  postPucHandler,
  getPucsHandler,
  getPucByIdHandler,
  patchPucStatusHandler,
} = require("./puc.controller");

const { lookupPucHandler } = require("./puc.lookup.controller");

async function pucRoutes(fastify) {
  fastify.post("/api/pucs", postPucHandler);
  fastify.get("/api/pucs", getPucsHandler);
  fastify.get("/api/pucs/:id", getPucByIdHandler);
  fastify.patch("/api/pucs/:id/status", patchPucStatusHandler);

  // user dashboard lookup (no login): pucNo + email
  fastify.get("/api/pucs/lookup", lookupPucHandler);
}

module.exports = { pucRoutes };


const {
  postAdmissionHandler,
  getAdmissionsHandler,
  getAdmissionByIdHandler,
  patchAdmissionStatusHandler,
} = require("./admission.controller");

const { lookupAdmissionHandler } = require("./admission.lookup.controller");

async function admissionRoutes(fastify) {
  fastify.post("/api/admissions", postAdmissionHandler);
  fastify.get("/api/admissions", getAdmissionsHandler);
  fastify.get("/api/admissions/:id", getAdmissionByIdHandler);
  fastify.patch("/api/admissions/:id/status", patchAdmissionStatusHandler);

  // User dashboard lookup (no login): admissionNo + email
  fastify.get("/api/admissions/lookup", lookupAdmissionHandler);
}

module.exports = { admissionRoutes };


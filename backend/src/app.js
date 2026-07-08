const fastify = require("fastify");
const fastifyCors = require("@fastify/cors");

const { admissionRoutes } = require("./modules/admission/admission.route");
const { pucRoutes } = require("./modules/puc/puc.route");
const { insuranceRoutes } = require("./modules/insurance/insurance.route");
const { licenceRoutes } = require("./modules/licence/licence.route");
const { maintenanceRoutes } = require("./modules/maintenance/maintenance.route");
const { adminAuthRoutes } = require("./modules/admin-auth/admin-auth.route");

async function buildApp() {
  const app = fastify({
    logger: true,
  });


  // CORS (dev friendly). If you need stricter rules later, replace `origin: true` with an allowlist.
  await app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Is-Admin", "x-is-admin"],
  });

  // Routes
  await app.register(admissionRoutes, { prefix: "" });
  await app.register(pucRoutes, { prefix: "" });
  await app.register(insuranceRoutes, { prefix: "" });
  await app.register(licenceRoutes, { prefix: "" });
  await app.register(maintenanceRoutes, { prefix: "" });
  await app.register(adminAuthRoutes, { prefix: "" });

  // Not found handler

  app.setNotFoundHandler((req, reply) => {
    reply.code(404).send({
      success: false,
      message: "Route not found",
    });
  });

  // Error handler
  app.setErrorHandler((error, req, reply) => {
    const statusCode = error.statusCode || error.status || 500;
    reply.code(statusCode).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });

  return app;
}

module.exports = { buildApp };

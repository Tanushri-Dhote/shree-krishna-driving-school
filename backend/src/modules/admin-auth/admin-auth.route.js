const {
  requestAdminOtpHandler,
  verifyAdminOtpHandler,
} = require("./admin-auth.controller");

async function adminAuthRoutes(fastify) {
  fastify.post(
    "/api/admin/auth/request-otp",
    requestAdminOtpHandler
  );
  fastify.post(
    "/api/admin/auth/verify-otp",
    verifyAdminOtpHandler
  );
}

module.exports = { adminAuthRoutes };


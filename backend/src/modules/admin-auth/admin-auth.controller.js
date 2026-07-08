const {
  requestAdminOtp,
  verifyAdminOtp,
  tokenPayloadFrom,
} = require("./admin-auth.service");

const { z } = require("zod");

const requestOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().min(6).max(6),
});

async function requestAdminOtpHandler(req, res) {
  const parsed = requestOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues,
    });
  }

  try {
    const data = await requestAdminOtp(parsed.data);
    return res.status(200).send({ success: true, data });
  } catch (err) {
    const statusCode = err?.statusCode || err?.status || 500;
    return res.status(statusCode).send({
      success: false,
      message: err?.message || "Internal Server Error",
    });
  }
}

async function verifyAdminOtpHandler(req, res) {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues,
    });
  }

  try {
    const data = await verifyAdminOtp(parsed.data);
    return res.status(200).send({ success: true, data });
  } catch (err) {
    const statusCode = err?.statusCode || err?.status || 500;
    return res.status(statusCode).send({
      success: false,
      message: err?.message || "Internal Server Error",
    });
  }
}

module.exports = {
  requestAdminOtpHandler,
  verifyAdminOtpHandler,
};


const { z } = require("zod");

const admissionLookupSchema = z.object({
  admissionNo: z.string().min(1, "admissionNo is required"),
  email: z.string().email("Valid email is required"),
});

module.exports = { admissionLookupSchema };


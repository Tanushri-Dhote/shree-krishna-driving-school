const { z } = require("zod");

const pucLookupSchema = z.object({
  pucNo: z.string().min(1, "pucNo is required"),
  email: z.string().email("Valid email is required"),
});

module.exports = { pucLookupSchema };


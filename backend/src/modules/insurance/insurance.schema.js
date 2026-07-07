const { z } = require("zod");

const insuranceStatusSchema = z
  .enum(["pending", "approved", "rejected"])
  .default("pending");

const insuranceCreateSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  email: z.string().email("Valid email is required"),
  mobileNo: z.string().min(1, "mobileNo is required"),
  vehicleNo: z.string().min(1, "vehicleNo is required"),
  panPhoto: z.string().min(1, "panPhoto is required"),
  aadhaarPhoto: z.string().min(1, "aadhaarPhoto is required"),
  rcFrontPhoto: z.string().min(1, "rcFrontPhoto is required"),
  rcBackPhoto: z.string().min(1, "rcBackPhoto is required"),
});

const insuranceStatusPatchSchema = z.object({
  status: insuranceStatusSchema,
});

module.exports = {
  insuranceCreateSchema,
  insuranceStatusPatchSchema,
};

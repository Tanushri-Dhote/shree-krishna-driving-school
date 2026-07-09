const { z } = require("zod");

const licenceStatusSchema = z
  .enum(["pending", "approved", "rejected"])
  .default("pending");

const licenceCreateSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),

  email: z.string().email("Valid email is required"),

  mobileNo: z.string().min(1, "mobileNo is required"),

  // NEW FIELD
  dob: z.string().min(1, "Date of Birth is required"),

  panPhoto: z.string().min(1, "panPhoto is required"),

  aadhaarPhoto: z.string().min(1, "aadhaarPhoto is required"),

  signaturePhoto: z.string().min(1, "signaturePhoto is required"),
});

const licenceStatusPatchSchema = z
  .object({
    status: licenceStatusSchema,

    // Stored only when admin approves
    applicationNo: z.string().min(1).optional(),
  })
  .refine(
    (val) => {
      if (val.status === "approved") {
        return (
          !!val.applicationNo &&
          String(val.applicationNo).trim().length > 0
        );
      }
      return true;
    },
    {
      message: "applicationNo is required when status is approved",
      path: ["applicationNo"],
    }
  );

module.exports = {
  licenceCreateSchema,
  licenceStatusPatchSchema,
};
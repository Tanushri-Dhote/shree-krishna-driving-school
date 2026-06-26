const { z } = require("zod");

const admissionStatusSchema = z
  .enum(["pending", "approved", "rejected"])
  .default("pending");

const admissionCreateSchema = z
  .object({
    fullName: z.string().min(1, "fullName is required"),
    email: z.string().email("Valid email is required"),
    mobileNo: z.string().min(1, "mobileNo is required"),
    hasDrivingLicence: z.boolean(),
    drivingLicenceNo: z.string().nullable().optional(),
    aadhaarPhoto: z.string().min(1, "aadhaarPhoto is required"),
    passportPhoto: z.string().min(1, "passportPhoto is required"),
  })
  .superRefine((val, ctx) => {
    if (val.hasDrivingLicence) {
      const dl = val.drivingLicenceNo;
      if (dl === null || dl === undefined || String(dl).trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["drivingLicenceNo"],
          message: "drivingLicenceNo is required when hasDrivingLicence = true",
        });
      }
    }
  });


const admissionStatusPatchSchema = z.object({
  status: admissionStatusSchema,
});

module.exports = {
  admissionCreateSchema,
  admissionStatusPatchSchema,
};

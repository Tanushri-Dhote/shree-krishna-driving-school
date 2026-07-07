const { z } = require("zod");

const pucStatusSchema = z
  .enum(["pending", "approved", "rejected"])
  .default("pending");

const pucCreateSchema = z
  .object({
    fullName: z.string().min(1, "fullName is required"),
       rcNumber: z.string().min(1, "rcNumber is required"),
    email: z.string().email("Valid email is required"),
    mobileNo: z.string().min(1, "mobileNo is required"),
 
   
  })
  .superRefine((val, ctx) => {
    // reserved for additional validations
    return val;
  });

const pucStatusPatchSchema = z.object({
  status: pucStatusSchema,
});

module.exports = {
  pucCreateSchema,
  pucStatusPatchSchema,
};


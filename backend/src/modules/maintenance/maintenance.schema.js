const { z } = require("zod");

const maintenanceCreateSchema = z.object({
  sr: z.number().int().positive().optional(),
  bookingDate: z.string().datetime().optional(),
  agentName: z.string().optional(),
  phoneNumber: z.string().optional(),
  customerName: z.string().optional(),
  product: z.string().optional(),
  policyType: z.string().optional(),
  makeModel: z.string().optional(),
  vehicleNumber: z.string().optional(),
  company: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  amountRs: z.number().positive().optional(),
});

const maintenanceUpdateSchema = z.object({
  sr: z.number().int().positive().optional().nullable(),
  bookingDate: z.string().datetime().optional().nullable(),
  agentName: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  product: z.string().optional().nullable(),
  policyType: z.string().optional().nullable(),
  makeModel: z.string().optional().nullable(),
  vehicleNumber: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  amountRs: z.number().positive().optional().nullable(),
});

module.exports = {
  maintenanceCreateSchema,
  maintenanceUpdateSchema,
};


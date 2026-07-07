const { prisma } = require("../../config/prisma");

function toDateOrNull(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return new Date(value);
}

async function createMaintenance(data) {
  return prisma.maintenance.create({
    data: {
      sr: data.sr ?? null,
      bookingDate: toDateOrNull(data.bookingDate) ?? null,
      agentName: data.agentName ?? null,
      phoneNumber: data.phoneNumber ?? null,
      customerName: data.customerName ?? null,
      product: data.product ?? null,
      policyType: data.policyType ?? null,
      makeModel: data.makeModel ?? null,
      vehicleNumber: data.vehicleNumber ?? null,
      company: data.company ?? null,
      startDate: toDateOrNull(data.startDate) ?? null,
      endDate: toDateOrNull(data.endDate) ?? null,
      amountRs: data.amountRs ?? null,
    },
  });
}

async function listMaintenances() {
  return prisma.maintenance.findMany({
    orderBy: { id: "desc" },
  });
}

async function getMaintenanceById(id) {
  const numericId = Number(id);
  const existing = await prisma.maintenance.findUnique({
    where: { id: numericId },
  });

  if (!existing) {
    const err = new Error("Maintenance record not found");
    err.statusCode = 404;
    throw err;
  }

  return existing;
}

async function updateMaintenance(id, data) {
  const numericId = Number(id);
  const existing = await prisma.maintenance.findUnique({
    where: { id: numericId },
  });
  if (!existing) {
    const err = new Error("Maintenance record not found");
    err.statusCode = 404;
    throw err;
  }

  const updateData = {};

  if (data.sr !== undefined) updateData.sr = data.sr;
  if (data.bookingDate !== undefined) updateData.bookingDate = toDateOrNull(data.bookingDate);
  if (data.agentName !== undefined) updateData.agentName = data.agentName;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
  if (data.customerName !== undefined) updateData.customerName = data.customerName;
  if (data.product !== undefined) updateData.product = data.product;
  if (data.policyType !== undefined) updateData.policyType = data.policyType;
  if (data.makeModel !== undefined) updateData.makeModel = data.makeModel;
  if (data.vehicleNumber !== undefined) updateData.vehicleNumber = data.vehicleNumber;
  if (data.company !== undefined) updateData.company = data.company;
  if (data.startDate !== undefined) updateData.startDate = toDateOrNull(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = toDateOrNull(data.endDate);
  if (data.amountRs !== undefined) updateData.amountRs = data.amountRs;

  return prisma.maintenance.update({
    where: { id: numericId },
    data: updateData,
  });
}

async function deleteMaintenance(id) {
  const numericId = Number(id);
  const existing = await prisma.maintenance.findUnique({
    where: { id: numericId },
  });
  if (!existing) {
    const err = new Error("Maintenance record not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.maintenance.delete({
    where: { id: numericId },
  });
}

module.exports = {
  createMaintenance,
  listMaintenances,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};


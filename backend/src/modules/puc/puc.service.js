const { prisma } = require("../../config/prisma");

function generatePucNo() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  // short random suffix
  const rnd = Math.floor(Math.random() * 9000 + 1000);
  return `PUC-${yyyy}${mm}${dd}-${rnd}`;
}

async function createPuc(data) {
  const pucNo = generatePucNo();

  return prisma.puc.create({
    data: {
      pucNo,
      fullName: data.fullName,
      email: data.email,
      mobileNo: data.mobileNo,
      rcNumber: data.rcNumber,
    },
  });
}

async function listPucs() {
  return prisma.puc.findMany({
    orderBy: { id: "desc" },
  });
}

async function getPucById(id) {
  const numericId = Number(id);
  return prisma.puc.findUnique({ where: { id: numericId } });
}

async function getPucByLookup({ pucNo, email }) {
  return prisma.puc.findFirst({
    where: {
      pucNo,
      email,
    },
  });
}

async function patchPucStatus(id, status) {
  const numericId = Number(id);

  const existing = await prisma.puc.findUnique({ where: { id: numericId } });
  if (!existing) {
    const err = new Error("PUC not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.puc.update({
    where: { id: numericId },
    data: { status },
  });
}

module.exports = {
  createPuc,
  listPucs,
  getPucById,
  getPucByLookup,
  patchPucStatus,
};


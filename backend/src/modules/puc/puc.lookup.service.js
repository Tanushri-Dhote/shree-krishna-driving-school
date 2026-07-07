const { prisma } = require("../../config/prisma");

async function lookupPuc({ pucNo, email }) {
  return prisma.puc.findFirst({ where: { pucNo, email } });
}

module.exports = { lookupPuc };


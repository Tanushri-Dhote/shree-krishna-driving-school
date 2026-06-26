const { prisma } = require("../../config/prisma");

async function lookupAdmission({ admissionNo, email }) {
  const admission = await prisma.admission.findUnique({
    where: { admissionNo },
  });

  if (!admission || admission.email !== email) {
    const e = new Error("Admission not found");
    e.statusCode = 404;
    throw e;
  }

  return admission;
}

module.exports = { lookupAdmission };


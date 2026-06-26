const { prisma } = require("../../config/prisma");

function parseAdmissionNoSuffix(admissionNo) {
  // Expected: SKDS-2026-0001
  const parts = String(admissionNo).split("-");
  if (parts.length !== 3) return null;

  const [prefix, year, seq] = parts;
  if (!prefix || !year || !seq) return null;

  const n = Number(seq);
  if (!Number.isFinite(n)) return null;

  return { year, seqNumber: n };
}

function buildAdmissionNo(year, seqNumber) {
  const padded = String(seqNumber).padStart(4, "0");
  return `SKDS-${year}-${padded}`;
}

async function generateNextAdmissionNo() {
  const year = new Date().getFullYear();
  // Find the current max admissionNo for this year by sorting on created admissionNo suffix.
  const latest = await prisma.admission.findFirst({
    where: {
      admissionNo: {
        startsWith: `SKDS-${year}-`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      admissionNo: true,
    },
  });

  let nextSeq = 1;
  if (latest?.admissionNo) {
    const parsed = parseAdmissionNoSuffix(latest.admissionNo);
    if (parsed?.year === String(year) && parsed.seqNumber) {
      nextSeq = parsed.seqNumber + 1;
    }
  }

  return buildAdmissionNo(year, nextSeq);
}

const { sendMail } = require("../../utils/mailer");

async function createAdmission(payload) {
  const admissionNo = await generateNextAdmissionNo();

  try {
    const created = await prisma.admission.create({
      data: {
        admissionNo,
        fullName: payload.fullName,
        email: payload.email,
        mobileNo: payload.mobileNo,

        hasDrivingLicence: payload.hasDrivingLicence,
        drivingLicenceNo: payload.hasDrivingLicence
          ? payload.drivingLicenceNo
          : null,
        aadhaarPhoto: payload.aadhaarPhoto,
        passportPhoto: payload.passportPhoto,
        status: "pending",
        remarks: null,
      },
      select: {
        admissionNo: true,
      },
    });

    // Send confirmation email (do not fail admission creation if email fails)
    (async () => {
      try {
        await sendMail({
          to: payload.email,
          subject: "Admission Submitted",
          text: `Admission Submitted\n\nAdmission No: ${admissionNo}\n\nThank you for choosing Shree Krishna Driving School.`,
        });
      } catch (mailErr) {
        // Log and keep the API successful
        console.error("Failed to send admission confirmation email:", mailErr);
      }
    })();

    return created;
  } catch (err) {
    // Unique collision on admissionNo: retry once with a regenerated number.
    if (err?.code === "P2002") {
      const admissionNoRetry = await generateNextAdmissionNo();
      const created = await prisma.admission.create({
        data: {
          admissionNo: admissionNoRetry,
          fullName: payload.fullName,
          email: payload.email,
          mobileNo: payload.mobileNo,
          hasDrivingLicence: payload.hasDrivingLicence,
          drivingLicenceNo: payload.hasDrivingLicence
            ? payload.drivingLicenceNo
            : null,
          aadhaarPhoto: payload.aadhaarPhoto,
          passportPhoto: payload.passportPhoto,
          status: "pending",
          remarks: null,
        },
        select: {
          admissionNo: true,
        },
      });

      // Send confirmation email (do not fail admission creation if email fails)
      (async () => {
        try {
          await sendMail({
            to: payload.email,
            subject: "Admission Submitted",
            text: `Admission Submitted\n\nAdmission No: ${admissionNoRetry}\n\nThank you for choosing Shree Krishna Driving School.`,
          });
        } catch (mailErr) {
          console.error("Failed to send admission confirmation email:", mailErr);
        }
      })();

      return created;
    }

    throw err;
  }
}

async function listAdmissions() {
  return prisma.admission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

async function getAdmissionById(id) {
  const admission = await prisma.admission.findUnique({
    where: { id: Number(id) },
  });

  if (!admission) {
    const e = new Error("Admission not found");
    e.statusCode = 404;
    throw e;
  }

  return admission;
}

async function patchAdmissionStatus(id, status) {
  const admission = await prisma.admission.findUnique({
    where: { id: Number(id) },
    select: { id: true },
  });

  if (!admission) {
    const e = new Error("Admission not found");
    e.statusCode = 404;
    throw e;
  }

  return prisma.admission.update({
    where: { id: Number(id) },
    data: { status },
  });
}

module.exports = {
  createAdmission,
  listAdmissions,
  getAdmissionById,
  patchAdmissionStatus,
};

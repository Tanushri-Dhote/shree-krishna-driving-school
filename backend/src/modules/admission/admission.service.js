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

        // Payment
        paid: true,
        paymentAmountRs:
          payload.paymentAmountRs !== undefined && payload.paymentAmountRs !== null
            ? payload.paymentAmountRs
            : null,
        paymentProof: payload.paymentProof,

        status: "pending",
        remarks: null,

        // approvedAt will be set when admin approves
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

          // Payment
          paid: true,
          paymentAmountRs:
            payload.paymentAmountRs !== undefined && payload.paymentAmountRs !== null
              ? payload.paymentAmountRs
              : null,
          paymentProof: payload.paymentProof,

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
    select: {
      id: true,
      admissionNo: true,
      fullName: true,
      email: true,
      mobileNo: true,
      hasDrivingLicence: true,
      drivingLicenceNo: true,
      aadhaarPhoto: true,
      passportPhoto: true,
      paymentProof: true,
      paymentAmountRs: true,
      paid: true,
      approvedAt: true,
      status: true,
      remarks: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}


async function getAdmissionById(id) {
  const admission = await prisma.admission.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      admissionNo: true,
      fullName: true,
      email: true,
      mobileNo: true,
      hasDrivingLicence: true,
      drivingLicenceNo: true,
      aadhaarPhoto: true,
      passportPhoto: true,
      paymentProof: true,
      paymentAmountRs: true,
      paid: true,
      approvedAt: true,
      status: true,
      remarks: true,
      createdAt: true,
      updatedAt: true,
    },
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
    select: { id: true, email: true, fullName: true, admissionNo: true, status: true },
  });

  if (!admission) {
    const e = new Error("Admission not found");
    e.statusCode = 404;
    throw e;
  }

  const updated = await prisma.admission.update({
    where: { id: Number(id) },
    data: {
      status,
      ...(status === "approved" && admission.status !== "approved"
        ? { approvedAt: new Date() }
        : {}),
      ...(status === "rejected" && admission.status !== "rejected"
        ? { approvedAt: null }
        : {}),
    },
  });

  // Only send the email if the status transitioned from anything else to "approved"
  // Send email when status changes
  if (status !== admission.status) {
    let subject = "";
    let text = "";

    if (status === "approved") {
      subject = "🎉 Admission Approved - Shree Krishna Driving School";

      text = `Dear ${admission.fullName},

Congratulations!

Your admission has been APPROVED.

Admission No: ${admission.admissionNo}

You can start your driving classes from tomorrow.

Training Timings:
🕗 Morning 8:00 AM to 6:00 PM

If you have any questions, please contact us:
📞 7499279503

Thank you for choosing Shree Krishna Driving School.

We look forward to helping you become a safe and confident driver.

Regards,
Shree Krishna Driving School`;
    }

    if (status === "rejected") {
      subject = "Admission Status - Shree Krishna Driving School";

      text = `Dear ${admission.fullName},

We regret to inform you that your admission application has been REJECTED.

Admission No: ${admission.admissionNo}

If you would like to know the reason or need any assistance, please contact us.

📞 Contact: 7499279503

Thank you for your interest in Shree Krishna Driving School.

We wish you all the best for your future.

Regards,
Shree Krishna Driving School`;
    }

    if (subject) {
      (async () => {
        try {
          await sendMail({
            to: admission.email,
            subject,
            text,
          });
        } catch (mailErr) {
          console.error("Failed to send admission status email:", mailErr);
        }
      })();
    }
  }

  return updated;
}

module.exports = {
  createAdmission,
  listAdmissions,
  getAdmissionById,
  patchAdmissionStatus,
};

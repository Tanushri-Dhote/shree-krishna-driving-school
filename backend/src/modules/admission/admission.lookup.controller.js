const { lookupAdmission } = require("./admission.lookup.service");
const { admissionLookupSchema } = require("./admission.lookup.schema");

function sendError(res, err) {
  const statusCode = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";

  return res.status(statusCode).send({
    success: false,
    message,
  });
}

async function lookupAdmissionHandler(req, res) {
  try {
    const parsed = admissionLookupSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const data = await lookupAdmission(parsed.data);

    // Only return public details for dashboard
    return res.send({
      success: true,
      data: {
        id: data.id,
        admissionNo: data.admissionNo,
        fullName: data.fullName,
        email: data.email,
        mobileNo: data.mobileNo,
        hasDrivingLicence: data.hasDrivingLicence,
        drivingLicenceNo: data.drivingLicenceNo,
        aadhaarPhoto: data.aadhaarPhoto,
        passportPhoto: data.passportPhoto,
        status: data.status,
        remarks: data.remarks,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  } catch (err) {
    return sendError(res, err);
  }
}


module.exports = { lookupAdmissionHandler };


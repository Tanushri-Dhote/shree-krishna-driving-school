const {
  createAdmission,
  listAdmissions,
  getAdmissionById,
  patchAdmissionStatus,
} = require("./admission.service");

const {
  admissionCreateSchema,
  admissionStatusPatchSchema,
} = require("./admission.schema");

function sendError(res, err) {
  const statusCode = err?.statusCode || err?.status || 500;
  const message =
    err?.message || "Internal Server Error";

  return res.status(statusCode).send({
    success: false,
    message,
  });
}

async function postAdmissionHandler(req, res) {
  try {
    const parsed = admissionCreateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const data = await createAdmission(parsed.data);

    return res.status(201).send({
      success: true,
      message: "Admission submitted successfully",
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}



async function getAdmissionsHandler(req, res) {
  try {
    const data = await listAdmissions();

    return res.send({
      success: true,
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getAdmissionByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const data = await getAdmissionById(id);

    return res.send({
      success: true,
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

async function patchAdmissionStatusHandler(req, res) {
  try {
    const { id } = req.params;

    const parsed = admissionStatusPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const data = await patchAdmissionStatus(id, parsed.data.status);

    return res.send({
      success: true,
      message: "Admission status updated successfully",
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  postAdmissionHandler,
  getAdmissionsHandler,
  getAdmissionByIdHandler,
  patchAdmissionStatusHandler,
};

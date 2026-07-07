const {
  createPuc,
  listPucs,
  getPucById,
  patchPucStatus,
} = require("./puc.service");

const { pucCreateSchema, pucStatusPatchSchema } = require("./puc.schema");


function sendError(res, err) {
  const statusCode = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";
  return res.status(statusCode).send({ success: false, message });
}

async function postPucHandler(req, res) {
  try {
    const parsed = pucCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const data = await createPuc(parsed.data);

    return res.status(201).send({
      success: true,
      message: "PUC submitted successfully",
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getPucsHandler(req, res) {
  try {
    const data = await listPucs();
    return res.send({ success: true, data });
  } catch (err) {
    return sendError(res, err);
  }
}

async function getPucByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const data = await getPucById(id);
    return res.send({ success: true, data });
  } catch (err) {
    return sendError(res, err);
  }
}

async function patchPucStatusHandler(req, res) {
  try {
    const { id } = req.params;

    const parsed = pucStatusPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }

    const data = await patchPucStatus(id, parsed.data.status);

    return res.send({
      success: true,
      message: "PUC status updated successfully",
      data,
    });
  } catch (err) {
    return sendError(res, err);
  }
}

module.exports = {
  postPucHandler,
  getPucsHandler,
  getPucByIdHandler,
  patchPucStatusHandler,
};


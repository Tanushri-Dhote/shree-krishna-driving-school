const {
    createInsurance,
    listInsurances,
    getInsuranceById,
    patchInsuranceStatus,
} = require("./insurance.service");

const {
    insuranceCreateSchema,
    insuranceStatusPatchSchema,
} = require("./insurance.schema");

function sendError(res, err) {
    const statusCode = err?.statusCode || err?.status || 500;
    const message = err?.message || "Internal Server Error";
    return res.status(statusCode).send({ success: false, message });
}

async function postInsuranceHandler(req, res) {
    try {
        const parsed = insuranceCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await createInsurance(parsed.data);

        return res.status(201).send({
            success: true,
            message: "Insurance submitted successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getInsurancesHandler(req, res) {
    try {
        const data = await listInsurances();
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getInsuranceByIdHandler(req, res) {
    try {
        const { id } = req.params;
        const data = await getInsuranceById(id);
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function patchInsuranceStatusHandler(req, res) {
    try {
        const { id } = req.params;

        const parsed = insuranceStatusPatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await patchInsuranceStatus(id, parsed.data.status);

        return res.send({
            success: true,
            message: "Insurance status updated successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

module.exports = {
    postInsuranceHandler,
    getInsurancesHandler,
    getInsuranceByIdHandler,
    patchInsuranceStatusHandler,
};

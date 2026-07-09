const {
    createLicence,
    listLicences,
    getLicenceById,
    patchLicenceStatus,
} = require("./licence.service");

const {
    licenceCreateSchema,
    licenceStatusPatchSchema,
} = require("./licence.schema");

function sendError(res, err) {
    const statusCode = err?.statusCode || err?.status || 500;
    const message = err?.message || "Internal Server Error";
    return res.status(statusCode).send({ success: false, message });
}

async function postLicenceHandler(req, res) {
    try {
        const parsed = licenceCreateSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await createLicence(parsed.data);

        return res.status(201).send({
            success: true,
            message: "Driving Licence form submitted successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getLicencesHandler(req, res) {
    try {
        const data = await listLicences();
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getLicenceByIdHandler(req, res) {
    try {
        const { id } = req.params;
        const data = await getLicenceById(id);
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function patchLicenceStatusHandler(req, res) {
    try {
        const { id } = req.params;

        // Frontend sends { status, applicationNumber } (not applicationNo)
        // Convert to backend-expected key applicationNo.
        const body = {
            ...req.body,
            applicationNo:
                req.body.applicationNo ??
                req.body.applicationNumber ??
                req.body.application_number ??
                req.body.application_field,
        };



        const parsed = licenceStatusPatchSchema.safeParse(body);

        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await patchLicenceStatus(
            id,
            parsed.data.status,
            parsed.data.applicationNo
        );



        return res.send({
            success: true,
            message: "Licence status updated successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

module.exports = {
    postLicenceHandler,
    getLicencesHandler,
    getLicenceByIdHandler,
    patchLicenceStatusHandler,
};

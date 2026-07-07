const {
    createMaintenance,
    listMaintenances,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance,
} = require("./maintenance.service");

const {
    maintenanceCreateSchema,
    maintenanceUpdateSchema,
} = require("./maintenance.schema");

function sendError(res, err) {
    const statusCode = err?.statusCode || err?.status || 500;
    const message = err?.message || "Internal Server Error";
    return res.status(statusCode).send({ success: false, message });
}

// Admin check middleware
function checkAdmin(req, res) {
    // Check if user is admin - you can customize this based on your auth system
    // For now, we'll assume it's passed via header or session
    const isAdmin = req.headers["x-is-admin"] === "true" || req.user?.role === "admin";
    if (!isAdmin) {
        res.status(403).send({ success: false, message: "Admin access required" });
        return false;
    }
    return true;
}

async function postMaintenanceHandler(req, res) {
    if (!checkAdmin(req, res)) return;

    try {
        const parsed = maintenanceCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await createMaintenance(parsed.data);

        return res.status(201).send({
            success: true,
            message: "Maintenance record created successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getMaintenancesHandler(req, res) {
    try {
        const data = await listMaintenances();
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function getMaintenanceByIdHandler(req, res) {
    try {
        const { id } = req.params;
        const data = await getMaintenanceById(id);
        return res.send({ success: true, data });
    } catch (err) {
        return sendError(res, err);
    }
}

async function patchMaintenanceHandler(req, res) {
    if (!checkAdmin(req, res)) return;

    try {
        const { id } = req.params;
        const parsed = maintenanceUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).send({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            });
        }

        const data = await updateMaintenance(id, parsed.data);
        return res.send({
            success: true,
            message: "Maintenance record updated successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

async function deleteMaintenanceHandler(req, res) {
    if (!checkAdmin(req, res)) return;

    try {
        const { id } = req.params;
        const data = await deleteMaintenance(id);
        return res.send({
            success: true,
            message: "Maintenance record deleted successfully",
            data,
        });
    } catch (err) {
        return sendError(res, err);
    }
}

module.exports = {
    postMaintenanceHandler,
    getMaintenancesHandler,
    getMaintenanceByIdHandler,
    patchMaintenanceHandler,
    deleteMaintenanceHandler,
};

const { prisma } = require("../../config/prisma");

function generateInsuranceNo() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    return `INS-${yyyy}${mm}${dd}-${rnd}`;
}

async function createInsurance(data) {
    const insuranceNo = generateInsuranceNo();

    return prisma.insurance.create({
        data: {
            insuranceNo,
            fullName: data.fullName,
            email: data.email,
            mobileNo: data.mobileNo,
            vehicleNo: data.vehicleNo,
            panPhoto: data.panPhoto,
            aadhaarPhoto: data.aadhaarPhoto,
            rcFrontPhoto: data.rcFrontPhoto,
            rcBackPhoto: data.rcBackPhoto,
        },
    });
}

async function listInsurances() {
    return prisma.insurance.findMany({
        orderBy: { id: "desc" },
    });
}

async function getInsuranceById(id) {
    const numericId = Number(id);
    const existing = await prisma.insurance.findUnique({
        where: { id: numericId },
    });

    if (!existing) {
        const err = new Error("Insurance not found");
        err.statusCode = 404;
        throw err;
    }

    return existing;
}

async function patchInsuranceStatus(id, status) {
    const numericId = Number(id);

    const existing = await prisma.insurance.findUnique({
        where: { id: numericId },
    });
    if (!existing) {
        const err = new Error("Insurance not found");
        err.statusCode = 404;
        throw err;
    }

    return prisma.insurance.update({
        where: { id: numericId },
        data: { status },
    });
}

module.exports = {
    createInsurance,
    listInsurances,
    getInsuranceById,
    patchInsuranceStatus,
};

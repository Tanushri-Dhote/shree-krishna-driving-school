const { prisma } = require("../../config/prisma");

function generateLicenceNo() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 9000 + 1000);
    return `DL-${yyyy}${mm}${dd}-${rnd}`;
}

async function createLicence(data) {
    const licenceNo = generateLicenceNo();

    return prisma.licence.create({
        data: {
            licenceNo,
            fullName: data.fullName,
            email: data.email,
            mobileNo: data.mobileNo,
            panPhoto: data.panPhoto,
            aadhaarPhoto: data.aadhaarPhoto,
            signaturePhoto: data.signaturePhoto,
        },
    });
}

async function listLicences() {
    return prisma.licence.findMany({
        orderBy: { id: "desc" },
    });
}

async function getLicenceById(id) {
    const numericId = Number(id);
    const existing = await prisma.licence.findUnique({
        where: { id: numericId },
    });

    if (!existing) {
        const err = new Error("Licence request not found");
        err.statusCode = 404;
        throw err;
    }

    return existing;
}

async function patchLicenceStatus(id, status) {
    const numericId = Number(id);

    const existing = await prisma.licence.findUnique({
        where: { id: numericId },
    });
    if (!existing) {
        const err = new Error("Licence request not found");
        err.statusCode = 404;
        throw err;
    }

    return prisma.licence.update({
        where: { id: numericId },
        data: { status },
    });
}

module.exports = {
    createLicence,
    listLicences,
    getLicenceById,
    patchLicenceStatus,
};

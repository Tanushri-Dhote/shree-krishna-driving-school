const { pucLookupSchema } = require("./puc.lookup.schema");
const { lookupPuc } = require("./puc.lookup.service");

async function lookupPucHandler(req, res) {
  const parsed = pucLookupSchema.safeParse({
    pucNo: req.query?.pucNo,
    email: req.query?.email,
  });

  if (!parsed.success) {
    return res.status(400).send({
      success: false,
      message: "Validation failed",
      errors: parsed.error.issues,
    });
  }

  const data = await lookupPuc(parsed.data);
  if (!data) {
    return res.status(404).send({
      success: false,
      message: "PUC not found",
    });
  }

  return res.send({
    success: true,
    data,
  });
}

module.exports = { lookupPucHandler };


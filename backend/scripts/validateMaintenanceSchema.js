const { maintenanceCreateSchema } = require("../src/modules/maintenance/maintenance.schema");

function runTest(name, payload) {
  const res = maintenanceCreateSchema.safeParse(payload);
  console.log(`\n=== ${name} ===`);
  if (res.success) {
    console.log("VALID ✅");
    console.log(JSON.stringify(res.data, null, 2));
  } else {
    console.log("INVALID ❌");
    console.log(JSON.stringify(res.error.issues, null, 2));
  }
}

const validPayload = {
  sr: 1,
  bookingDate: new Date().toISOString(),
  agentName: "Agent A",
  phoneNumber: "9999999999",
  customerName: "John Doe",
  product: "Product X",
  policyType: "Type A",
  makeModel: "Model 2020",
  vehicleNumber: "MH12AB1234",
  company: "Company Ltd",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  amountRs: 1234.5,
};

const invalidPayload = Object.assign({}, validPayload, {
  vehicleNo: "SHOULD_NOT_BE_HERE",
  vehicleType: "SHOULD_NOT_BE_HERE",
  description: "SHOULD_NOT_BE_HERE",
  serviceType: "SHOULD_NOT_BE_HERE",
});

runTest("Valid payload (expected VALID)", validPayload);
runTest("Invalid payload with removed fields (expected INVALID)", invalidPayload);

// Exit with non-zero code when invalid payload unexpectedly passes
const check = maintenanceCreateSchema.safeParse(invalidPayload);
process.exit(check.success ? 1 : 0);

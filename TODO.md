# TODO - Driving Admission Payment Fields + Admin Approved View

## Step 1 (Backend/DB)
- [ ] Update `backend/prisma/schema.prisma` `admission` model with:
  - [ ] `paid` Boolean default false
  - [ ] `paymentAmountRs` Float nullable
  - [ ] `paymentProof` String @db.LongText nullable
  - [ ] `approvedAt` DateTime nullable

## Step 2 (Backend/API validation)
- [ ] Update `backend/src/modules/admission/admission.schema.js` to accept `paymentAmountRs` and `paymentProof`.
- [ ] Update `backend/src/modules/admission/admission.service.js` `createAdmission()` to store:
  - [ ] `paid: true` when payment screenshot exists
  - [ ] `paymentProof`, `paymentAmountRs`

## Step 3 (Backend approve timing)
- [ ] Update `patchAdmissionStatus()` to set `approvedAt = new Date()` when moving to `approved` from non-approved.

## Step 4 (Frontend admission form)
- [ ] Update `frontend/app/driving-Addmission/page.tsx` to add amount input (₹ Admission Amount).
- [ ] Send `paymentAmountRs` along with `paymentProof`.

## Step 5 (Admin UI)
- [ ] Update `frontend/components/dashbaord/AdmissionDetailsModal.tsx` to show payment section **only when status is approved**.
  - [ ] Amount
  - [ ] Payment screenshot preview
  - [ ] ApprovedAt time

## Step 6 (User dashboard / lookup)
- [ ] Optional: include payment fields in user lookup.

## Step 7 (Run/verify)
- [ ] Run prisma migration + regenerate client.
- [ ] Start backend and verify:
  - [ ] Submit admission saves payment fields
  - [ ] Admin approves sets approvedAt
  - [ ] Modal shows payment only for approved


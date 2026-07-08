const { sendMail } = require("../../utils/mailer");
const crypto = require("crypto");

// In-memory OTP store for demo/dev.
// Keyed by email: { otp, expiresAt }
const otpStore = new Map();

function generateOtp6() {
  // 000000-999999
  return String(Math.floor(100000 + Math.random() * 900000));
}

function isExpired(expiresAt) {
  return !expiresAt || Date.now() > expiresAt;
}

function getAdminEmailAllowlist() {
  // Optional: allow only specific admin emails.
  // Comma-separated, e.g. "vikas@example.com,admin2@example.com"
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return null;
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.length ? list : null;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function issueToken() {
  // Random token (not JWT) valid for 15 days.
  return crypto.randomBytes(32).toString("hex");
}

// In-memory token store.
// token -> { email, expiresAt }
const tokenStore = new Map();

function cleanupExpired() {
  const now = Date.now();

  for (const [_, v] of otpStore.entries()) {
    if (v?.expiresAt && now > v.expiresAt) {
      otpStore.delete(_);
    }
  }

  for (const [token, v] of tokenStore.entries()) {
    if (v?.expiresAt && now > v.expiresAt) {
      tokenStore.delete(token);
    }
  }
}

function tokenPayloadFrom(token) {
  const v = tokenStore.get(token);
  if (!v) return null;
  if (isExpired(v.expiresAt)) {
    tokenStore.delete(token);
    return null;
  }
  return { email: v.email };
}

async function requestAdminOtp({ email }) {
  cleanupExpired();

  const normalized = normalizeEmail(email);
  if (!normalized) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const allowlist = getAdminEmailAllowlist();
  if (allowlist && !allowlist.includes(normalized)) {
    const err = new Error("Admin email not allowed");
    err.statusCode = 403;
    throw err;
  }

  const otp = generateOtp6();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalized, { otp, expiresAt });

  const site = process.env.ADMIN_OTP_SUBJECT_PREFIX || "Driving School Admin OTP";

  // Send as plain text
  await sendMail({
    to: normalized,
    subject: `${site}`,
    text: `Your admin login OTP is: ${otp}. It expires in 10 minutes.`,
  });

  return { email: normalized };
}

async function verifyAdminOtp({ email, otp }) {
  cleanupExpired();

  const normalized = normalizeEmail(email);
  const record = otpStore.get(normalized);

  if (!normalized || !otp) {
    const err = new Error("Email and OTP are required");
    err.statusCode = 400;
    throw err;
  }

  if (!record || isExpired(record.expiresAt)) {
    const err = new Error("OTP expired or not found. Please request again.");
    err.statusCode = 400;
    throw err;
  }

  if (String(record.otp) !== String(otp).trim()) {
    const err = new Error("Invalid OTP");
    err.statusCode = 400;
    throw err;
  }

  // Issue token valid for 15 days.
  const token = issueToken();
  const expiresAt = Date.now() + 15 * 24 * 60 * 60 * 1000;
  tokenStore.set(token, { email: normalized, expiresAt });

  // Remove OTP after successful verification
  otpStore.delete(normalized);

  return { token, expiresAt };
}

module.exports = {
  requestAdminOtp,
  verifyAdminOtp,
  tokenPayloadFrom,
};


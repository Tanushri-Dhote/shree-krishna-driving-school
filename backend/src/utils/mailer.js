const nodemailer = require("nodemailer");

function getEnv(name) {
  return process.env[name];
}

function getSmtpConfig() {
  const host = getEnv("SMTP_HOST");
  const port = getEnv("SMTP_PORT");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const from = getEnv("SMTP_FROM");
  const secureRaw = getEnv("SMTP_SECURE");

  if (!host) throw new Error("Missing SMTP_HOST env var");
  if (!port) throw new Error("Missing SMTP_PORT env var");
  if (!user) throw new Error("Missing SMTP_USER env var");
  if (!pass) throw new Error("Missing SMTP_PASS env var");
  if (!from) throw new Error("Missing SMTP_FROM env var");

  const secure = String(secureRaw).toLowerCase() === "true";

  return {
    host,
    port: Number(port),
    secure,
    auth: {
      user,
      pass,
    },
    from,
  };
}

async function sendMail({ to, subject, text }) {
  const { host, port, secure, auth, from } = getSmtpConfig();

  if (!to) throw new Error("Missing recipient email (to)");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  });

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}

module.exports = {
  sendMail,
};


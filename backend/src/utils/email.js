import nodemailer from "nodemailer";

let transporter;

const isSmtpConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
};

const validateSmtpConfiguration = () => {
  const missingFields = [];
  if (!process.env.SMTP_HOST) missingFields.push("SMTP_HOST");
  if (!process.env.SMTP_PORT) missingFields.push("SMTP_PORT");
  if (!process.env.SMTP_USER) missingFields.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missingFields.push("SMTP_PASS");

  if (missingFields.length > 0) {
    console.warn(
      `[⚠️  SMTP] Missing configuration: ${missingFields.join(", ")}. Email sending (forgot-password, etc.) will fail.`,
    );
    return false;
  }

  console.info("[✓ SMTP] Email configuration validated successfully.");
  return true;
};

validateSmtpConfiguration();

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject) {
    throw new Error("Email recipient and subject are required");
  }

  if (!isSmtpConfigured()) {
    const missingFields = [];
    if (!process.env.SMTP_HOST) missingFields.push("SMTP_HOST");
    if (!process.env.SMTP_PORT) missingFields.push("SMTP_PORT");
    if (!process.env.SMTP_USER) missingFields.push("SMTP_USER");
    if (!process.env.SMTP_PASS) missingFields.push("SMTP_PASS");
    throw new Error(
      `SMTP is not configured. Missing: ${missingFields.join(", ")}. Check backend/.env`,
    );
  }

  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await getTransporter().sendMail({
    from: sender,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export { sendEmail };

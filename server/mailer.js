import nodemailer from "nodemailer";

let transporter = null;

export function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

export function getTransporter() {
  if (!isMailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEnquiryNotification(enquiry) {
  if (!isMailConfigured()) {
    console.warn("SMTP not configured — skipping enquiry email");
    return false;
  }

  const to = process.env.MAIL_TO;
  if (!to) {
    console.warn("MAIL_TO is not set — skipping enquiry email");
    return false;
  }

  const mailer = getTransporter();
  if (!mailer) return false;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const name = enquiry?.name || "(no name)";
  const email = enquiry?.email || "(no email)";
  const interest = enquiry?.interest || "(none)";
  const message = enquiry?.message || "";

  await mailer.sendMail({
    from,
    to,
    replyTo: enquiry?.email || undefined,
    subject: `UtopiaX enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Interest: ${interest}`,
      "",
      "Message:",
      message,
    ].join("\n"),
  });

  return true;
}

export async function sendEnquiryConfirmation(enquiry) {
  if (!isMailConfigured()) {
    console.warn("SMTP not configured — skipping enquiry confirmation email");
    return false;
  }

  const mailer = getTransporter();
  if (!mailer) return false;

  const to = enquiry?.email;
  if (!to) {
    console.warn("Enquiry has no email — skipping confirmation email");
    return false;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const name = enquiry?.name || "there";
  const message = enquiry?.message || "";

  await mailer.sendMail({
    from,
    to,
    subject: "We've received your enquiry - UtopiaX",
    text: [
      `Hi ${name},`,
      "",
      "Thank you for getting in touch with UtopiaX. We've received your enquiry and someone from our team will be in touch soon.",
      "",
      "Here's a copy of what you sent:",
      "",
      message,
      "",
      "Warm regards,",
      "The UtopiaX team",
    ].join("\n"),
  });

  return true;
}

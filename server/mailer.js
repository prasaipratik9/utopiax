import { Resend } from "resend";

const FROM = "UtopiaX <onboarding@resend.dev>";

let resendClient = null;

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getResend() {
  if (!isMailConfigured()) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendEnquiryNotification(enquiry) {
  if (!isMailConfigured()) {
    console.warn("RESEND_API_KEY not configured — skipping enquiry email");
    return false;
  }

  const to = process.env.MAIL_TO;
  if (!to) {
    console.warn("MAIL_TO is not set — skipping enquiry email");
    return false;
  }

  const resend = getResend();
  if (!resend) return false;

  const name = enquiry?.name || "(no name)";
  const email = enquiry?.email || "(no email)";
  const interest = enquiry?.interest || "(none)";
  const message = enquiry?.message || "";

  const { error } = await resend.emails.send({
    from: FROM,
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

  if (error) {
    throw new Error(error.message || "Resend notification failed");
  }

  return true;
}

export async function sendEnquiryConfirmation(enquiry) {
  if (!isMailConfigured()) {
    console.warn("RESEND_API_KEY not configured — skipping enquiry confirmation email");
    return false;
  }

  const resend = getResend();
  if (!resend) return false;

  const to = enquiry?.email;
  if (!to) {
    console.warn("Enquiry has no email — skipping confirmation email");
    return false;
  }

  const name = enquiry?.name || "there";
  const message = enquiry?.message || "";

  const { error } = await resend.emails.send({
    from: FROM,
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

  if (error) {
    throw new Error(error.message || "Resend confirmation failed");
  }

  return true;
}

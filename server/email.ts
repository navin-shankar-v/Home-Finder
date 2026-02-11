import nodemailer from "nodemailer";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  // If SMTP is configured, send real email; otherwise log the link (dev)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Roomies <noreply@roomies.com>",
      to,
      subject: "Verify your Roomies email",
      text: `Click the link to verify your email: ${verifyUrl}`,
      html: `<p>Click the link to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
  } else {
    console.log("[Roomies] Verification email (no SMTP configured):");
    console.log(`  To: ${to}`);
    console.log(`  Verify link: ${verifyUrl}`);
  }
}

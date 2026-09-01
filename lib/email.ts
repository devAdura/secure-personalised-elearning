const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export function isRecoveryEmailConfigured() {
  return Boolean(process.env.BREVO_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export async function sendPasswordResetCode(email: string, code: string) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "SecureLearn";
  if (!apiKey || !from) throw new Error("Recovery email is not configured.");

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: fromName, email: from },
      to: [{ email }],
      subject: "Your SecureLearn password reset code",
      textContent: `Your SecureLearn password reset code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this message.`,
      htmlContent: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#12201c"><h1 style="font-size:24px">Reset your SecureLearn password</h1><p>Enter this one-time code in SecureLearn:</p><p style="font-size:32px;font-weight:800;letter-spacing:8px;margin:24px 0">${code}</p><p>This code expires in 10 minutes. If you did not request a password reset, you can ignore this email.</p></div>`
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Recovery email provider rejected the request (${response.status}): ${detail.slice(0, 200)}`);
  }
}

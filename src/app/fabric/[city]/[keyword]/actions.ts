"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key_to_prevent_crash_on_load");

export async function sendSampleRequest(formData: {
  name: string;
  firm: string;
  email: string;
  phone: string;
  message: string;
  city?: string;
  keyword?: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Simulating email success.");
      return { success: true, simulated: true };
    }

    const { name, firm, email, phone, message, city, keyword } = formData;

    const emailContent = `
      <h2>New Sample Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Firm/Studio:</strong> ${firm}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <br/>
      <p><strong>Project Details:</strong><br/>${message || 'None provided'}</p>
      <br/>
      <p><small>Source: Programmatic SEO Landing Page (${city || 'N/A'} - ${keyword || 'N/A'})</small></p>
    `;

    const data = await resend.emails.send({
      from: "Leslie's Weaving Studio <hello@lesliesweavingstudio.com>",
      to: ["steven@simplyconnectedsystems.com"], // Update to final recipient
      subject: `New Fabric Sample Request from ${name} (${firm})`,
      html: emailContent,
      replyTo: email,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending sample request email:", error);
    return { success: false, error: String(error) };
  }
}

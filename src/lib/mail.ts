import nodemailer from 'nodemailer';
import { getCertificateHtml } from './certificateTemplate';

// Create a transporter using Gmail.
// To use this, you need to set EMAIL_PASSWORD in .env.local to a Gmail "App Password".
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'scdc52rupandehi@gmail.com',
    pass: process.env.EMAIL_PASSWORD, // This must be an App Password, not the regular Gmail password
  },
});

export interface EmailParams {
  type: "Contact Form" | "Whistleblower" | "Volunteer" | "System Alert" | "Volunteer Approved" | "New Donation" | "Donation Receipt";
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  amount?: string;
  purpose?: string;
}

export async function sendNotificationEmail({
  type,
  name,
  email,
  phone,
  subject,
  message,
  amount,
  purpose,
}: EmailParams) {
  // If no password is provided in env, gracefully skip to not crash the app
  if (!process.env.EMAIL_PASSWORD) {
    console.warn('EMAIL_PASSWORD is not set in .env.local. Skipping email notification.');
    return;
  }

  let htmlContent = '';
  let mailSubject = '';
  let toAddress = 'scdc52rupandehi@gmail.com';

  if (type === 'Donation Receipt') {
    toAddress = email || 'scdc52rupandehi@gmail.com';
    mailSubject = `Thank you for your generous donation to SCDC, ${name}!`;
    
    // Format date as DD-Month-YYYY
    const dateObj = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${dateObj.getDate()}-${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    
    const certUrl = `https://sungabha.org.np/api/certificate?name=${encodeURIComponent(name)}&amount=${encodeURIComponent(amount || '')}&purpose=${encodeURIComponent(purpose || '')}&date=${encodeURIComponent(formattedDate)}`;
    
    htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Thank You for Your Donation!</h2>
        </div>
        <div style="padding: 32px 24px; background-color: #f8fafc; text-align: center;">
          <h3 style="color: #334155; margin-top: 0;">Dear ${name},</h3>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you so much for your generous donation of <strong>${amount}</strong> towards <strong>${purpose}</strong>. Your contribution plays a vital role in helping Sungabha Community Development Centre (SCDC) empower marginalized communities and build a brighter future.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            In sincere recognition of your support, we have prepared a Certificate of Appreciation for you.
          </p>
          <a href="${certUrl}" style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">View & Download Certificate</a>
          
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 4px;">With immense gratitude,</p>
            <p style="color: #334155; font-weight: bold; margin-top: 0;">SCDC Executive Committee</p>
          </div>
        </div>
      </div>
    `;
  } else {
    mailSubject = `New ${type} Message from ${name}`;
    htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: ${type === 'Whistleblower' ? '#d97706' : type === 'New Donation' ? '#059669' : '#0284c7'}; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">New ${type} Submission</h2>
        </div>
        <div style="padding: 24px; background-color: #f8fafc;">
          <p><strong>Name:</strong> ${name}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${amount ? `<p><strong>Amount:</strong> ${amount}</p>` : ''}
          ${purpose ? `<p><strong>Purpose:</strong> ${purpose}</p>` : ''}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          
          ${message ? `
          <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; pt-4">
            <h3 style="color: #475569; margin-bottom: 8px;">Message Content:</h3>
            <div style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${message}</div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  const mailOptions = {
    from: '"SCDC Website" <scdc52rupandehi@gmail.com>',
    to: toAddress,
    replyTo: email || undefined,
    subject: mailSubject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent for ${type}`);
  } catch (error) {
    console.error('Failed to send notification email:', error);
    // We don't throw here so that the form submission still succeeds and saves to the database
  }
}

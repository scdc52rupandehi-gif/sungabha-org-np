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
    
    htmlContent = getCertificateHtml(name, formattedDate, amount || '', purpose || '');

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

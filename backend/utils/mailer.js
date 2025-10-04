// utils/mailer.js
const nodemailer = require('nodemailer');

async function sendViaResend({ to, from, subject, html, text }) {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log('[mailer] Using Resend with from=%s', from);
  const result = await resend.emails.send({ to, from, subject, html, text });
  // Resend doesn't provide a preview URL like Ethereal does
  console.log('[mailer] Resend sent. id=%s to=%s', result?.id, Array.isArray(to) ? to.join(',') : to);
  return { info: result, previewUrl: null };
}

let transporterPromise = null;
function getSmtpTransporter() {
  if (transporterPromise) return transporterPromise;

  if (process.env.SMTP_HOST) {
    console.log('[mailer] Using SMTP host=%s port=%s', process.env.SMTP_HOST, process.env.SMTP_PORT || 587);
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        logger: true,
        debug: true,
      })
    );
  } else {
    console.log('[mailer] No SMTP_HOST set → using Ethereal test account');
    transporterPromise = nodemailer.createTestAccount().then((account) => {
      console.log('[mailer] Ethereal user:', account.user);
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: account.user, pass: account.pass },
        logger: true,
        debug: true,
      });
    });
  }
  return transporterPromise;
}

async function sendViaSmtp(options) {
  const transporter = await getSmtpTransporter();
  const info = await transporter.sendMail(options);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log('🔗 Ethereal preview:', previewUrl);
  else console.log('[mailer] Sent via real SMTP. messageId:', info.messageId);
  return { info, previewUrl };
}

async function sendMail(options) {
  // Prefer Resend if key is present
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(options);
  }
  // Otherwise fall back to SMTP/Ethereal
  return sendViaSmtp(options);
}

module.exports = { sendMail };

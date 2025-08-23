// utils/mailer.js
const nodemailer = require('nodemailer');

let transporterPromise = null;

function getTransporter() {
  if (transporterPromise) return transporterPromise;

  if (process.env.SMTP_HOST) {
    console.log(`[mailer] Using SMTP host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT || 587}`);
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
        logger: true,
        debug: true,
      })
    );
  } else {
    console.log('[mailer] No SMTP_HOST set → using Ethereal test account');
    transporterPromise = nodemailer.createTestAccount().then((account) => {
      console.log('[mailer] Ethereal account user:', account.user);
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

async function sendMail(options) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail(options);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log('🔗 Ethereal preview:', previewUrl);
  else console.log('[mailer] Sent via real SMTP. messageId:', info.messageId);
  return { info, previewUrl };
}

module.exports = { sendMail };

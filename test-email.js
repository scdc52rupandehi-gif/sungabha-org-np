require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'scdc52rupandehi@gmail.com',
    pass: process.env.EMAIL_PASSWORD, 
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: '"SCDC Website" <scdc52rupandehi@gmail.com>',
      to: 'scdc52rupandehi@gmail.com',
      subject: 'Test Email',
      text: 'This is a test'
    });
    console.log('Success:', info.messageId);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();

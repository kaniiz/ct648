import axios from 'axios';
import nodemailer from 'nodemailer';

export async function sendLineNotify(message: string): Promise<void> {
  const lineNotifyToken = process.env.LINE_NOTIFY_TOKEN;
  
  if (!lineNotifyToken) {
    throw new Error('LINE_NOTIFY_TOKEN is not set');
  }

  try {
    await axios.post(
      'https://notify-api.line.me/api/notify',
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${lineNotifyToken}`,
        },
      }
    );
  } catch (error) {
    console.error('Error sending LINE Notify:', error);
    throw error;
  }
}

export async function sendEmailNotify(to: string, subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}
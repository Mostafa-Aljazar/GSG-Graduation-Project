'use server';
import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.gmail.com
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER, // mostafaibrahim20032020@gmail.com
        pass: process.env.SMTP_PASS, // ssbb egyc jhzi myoa
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM, // '"social-app-training" <no-reply@yourapp.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to send email. Please try again later.');
  }
}

import { sendEmail } from "@/utils/send-mail";

export interface ISendEmailProps {
    name: string;
    email: string;
    phone_number: string;
    message: string;
}

export const sendEmailFun = async ({
    name,
    email,
    phone_number,
    message,
}: ISendEmailProps) => {

    const IMG_Logo = `https://affvdhyw60.ufs.sh/f/D9fWnKmzxFZWZzxU0XRxmhHUVRKXaig4QbdYZG7MArz16NOo`

    const toEmail = "alaqsacamp@gmail.com"
    if (!toEmail) throw new Error("AQSA_CAMP_EMAIL is not defined in environment variables");


    const htmlContent = `
  <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
    <div style="max-width: 620px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #e5e5e5;">
      
      <div style="text-align: center; padding: 24px; background: #fafafa; border-bottom: 1px solid #eee;">
        <img src="${IMG_Logo}" 
             alt="Al-Aqsa Camp" 
             style="width: 90px; height: auto; display: block; margin: 0 auto 14px;" />
        <h2 style="margin: 0; font-size: 22px; color: #1a73e8; font-weight: 600;">
          Contact Form Message From Alaqsa Camp
        </h2>
      </div>

      <div style="padding: 24px; color: #333; font-size: 15px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone_number}</p>

        <div style="margin-top: 20px;">
          <strong>Message:</strong>
          <div style="margin-top: 8px; padding: 14px; background: #f9f9f9; border: 1px solid #eee; border-radius: 6px;">
            ${message}
          </div>
        </div>
      </div>

      <div style="text-align: center; padding: 18px; background: #fafafa; border-top: 1px solid #eee; font-size: 12px; color: #777;">
        Message sent from Al-Aqsa Camp Management System
      </div>
    </div>
  </div>
`;


    try {
        return await sendEmail({
            to: toEmail,
            subject: `New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phone_number}\nMessage: ${message}`,
            html: htmlContent,
        });
    } catch (err: unknown) {
        // Safely get the error message
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(message || "Failed to send email");
    }
};

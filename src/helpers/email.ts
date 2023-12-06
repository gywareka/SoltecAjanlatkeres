import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: "dev.tarjanyicsanad@gmail.com",
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

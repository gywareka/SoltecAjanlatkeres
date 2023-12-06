import { createTransport } from "nodemailer";

// const transporter = createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "dev.tarjanyicsanad@gmail.com",
//     pass: process.env.SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "dev.easysouls@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

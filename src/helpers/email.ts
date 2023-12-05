import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "dev.tarjanyicsanad@gmail.com",
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPriceOfferEmail(toEmail: string, fullName: string) {
  await transporter.sendMail({
    from: "noreply@krystaltear.com",
    to: toEmail,
    subject: "Soltec Árajánlat",
    html: `<h1>Tisztelt ${fullName}</h1>
        <p>Mellékelten küldjük az ön árajánlatát.</p><a>Tetszik</a>`,
  });
}

import express, { Request, Response, NextFunction } from "express";
import { createPdfDocument } from "../helpers";
import { adminRouter } from "./admin";
import { UserType, createUser } from "../db/users";
import { transporter } from "../helpers/email";
import { createTransport } from "nodemailer";

export const router = express.Router();

router.use("/admin", adminRouter);

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// This handles the post request for the form
router.post("/", async (req: Request, res: Response) => {
  console.log("[server] Form submitted");
  console.log("[server] Request: ", req.body);

  try {
    const user = await createUser(req.body);
    const userData: UserType = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      installationLocation: user.installationLocation,
      consumption: user.consumption,
    };

    createPdfDocument(userData);

    const mailOptions = {
      from: "dev.tarjanyicsanad@gmail.com",
      to: userData.email,
      subject: "Soltec Árajánlat",
      text: `<h1>Tisztelt ${userData.lastName} ${userData.firstName}</h1>
      <p>Mellékelten küldjük az ön árajánlatát.</p><a>Tetszik</a>`,
      attachments: [
        {
          filename: "arajanlat.pdf",
          path: "ajanlatkeres.pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).send(error);
      } else {
        res.status(200).send(`Email sent: ${info.response}`);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/invoice", (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment;filename="ajanlatkeres.pdf"',
  });
  next();
});

// Only used for testing
// Sends the email based on the request's body, but doesn't add a new user
// to the database
router.post("/send-email", (req, res) => {
  console.log("Sending email...");

  const mailOptions = {
    from: "dev.tarjanyicsanad@gmail.com",
    to: req.body.email,
    subject: "Soltec Árajánlat",
    text: `<h1>Tisztelt ${req.body.fullName}</h1>
    <p>Mellékelten küldjük az ön árajánlatát.</p><a>Tetszik</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      res.status(200).send(`Email sent: ${info.response}`);
    }
  });
});

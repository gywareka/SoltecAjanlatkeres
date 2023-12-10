import express, { Request, Response } from "express";
import { createPdfDocument, processPriceOfferAcceptance } from "../helpers";
import { adminRouter } from "./admin";
import { UserModel, UserType, createUser } from "../db/users";
import { transporter } from "../helpers/email";

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

    //TODO Change link when in production
    const mailOptions = {
      from: "dev.tarjanyicsanad@gmail.com",
      to: userData.email,
      subject: "Soltec Árajánlat",
      text: `<h3>Tisztelt ${userData.lastName} ${userData.firstName}</h3>
            <p>Mellékelten küldjük az ön árajánlatát. Ha előzetes ajánlatunk megnyerte tetszését, kérjük kattintson ide:</p>
            <a href="http://localhost:3000/visszajelzes/${user._id}">ÉRDEKEL</a>
            <p>és munkatársunk felveszi önnel a kapcsolatot</p>`,
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

// Only used for testing
// Sends the email based on the request's body, but doesn't add
// a new user to the database
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

router.get("/visszajelzes/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById(userId);

    // Check if the user has already accepted the offer
    // This prevent notifying Soltec more than one time from the same user
    if (!user.offerAccepted) {
      // Process the acceptance (notify the firm)
      await processPriceOfferAcceptance(user._id);

      res.render("feedback");
    } else {
      res.status(400).send("Az ajánlat már el lett fogadva");
    }
  } catch (error) {
    console.error("Hiba a visszajelzésben. Frissítse újra az oldalt!");
    res
      .status(500)
      .send(
        "Szerver hiba. Kérjük frissítse újra az oldalt, vagy próbálkozzon később."
      );
  }
});

import express, { Request, Response } from 'express';
import { processPriceOfferAcceptance } from '../helpers';
import { createPdfDocument, generatePdf } from '../helpers/pdf';
import { UserModel, UserType, createUser } from '../db/users';
import { transporter } from '../helpers/email';

export const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// This handles the post request for the form
router.post('/', async (req: Request, res: Response) => {
  console.log('[server] Form submitted');
  console.log('[server] Request: ', req.body);

  try {
    const user = await createUser(req.body);
    const userData: UserType = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      installationLocation: user.installationLocation,
      consumption: user.consumption,
    };

    //createPdfDocument(userData);
    await generatePdf(userData);

    //TODO Change link when in production
    const mailOptions = {
      from: 'info@soltec.hu',
      to: userData.email,
      subject: 'Soltec Árajánlat',
      text: `<h3>Tisztelt ${userData.lastName} ${userData.firstName}</h3>
            <p>Köszönjük, hogy megtisztelte cégünket érdeklődésével. Az Ön által megadott adatok alapján 
            mellékelten küldjük az Ön előzetes árajánlatát. Ha ajánlatunk nagyságrendileg 
            megnyerte tetszését, kérjük kattintson ide:</p>
            <a href="http://localhost:3000/visszajelzes/${user._id}">ÉRDEKEL</a>
            <p>Az "ÉRDEKEL" gomb megnyomásával adatait feldolgozzuk és ezt követően munkatársunk 
            felveszi önnel a kapcsolatot. </p> 
            <p>Amennyiben az "ÉRDEKEL" gombra 7 napon belül nem kattint, úgy az Ön által megadott adatokat rendszerünk törli. </p>`,
      attachments: [
        {
          filename: 'arajanlat.pdf',
          path: 'ajanlatkeres.pdf',
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

router.get('/visszajelzes/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById(userId);

    // Check if the user has already accepted the offer
    // This prevent notifying Soltec more than one time from the same user
    if (!user.offerAccepted) {
      // Process the acceptance (notify the firm)
      await processPriceOfferAcceptance(user._id);

      const userData: UserType = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        installationLocation: user.installationLocation,
        consumption: user.consumption,
      };

      await generatePdf(userData);

      // TODO Change to email address when deploying
      const mailOptions = {
        from: 'info@soltec.hu',
        to: 'ervin.sjt@gmail.com',
        subject: 'Árajánlat elfogadva',
        text: `<p>${user.lastName} ${user.firstName} elfogadta a számára generált árajánlatot</p>
              <p>Ezen az email címen tudja felvenni vele a kapcsolatot: ${user.email}</p>
              <p>Az ügyfél telefonszáma: ${user.phone}</p>
              <p>Ez a telepítési cím: ${user.installationLocation}
              <p>Mellékletként szerepel az ügyfél számára elküldött árajánlat.`,
        attachments: [
          {
            filename: 'arajanlat.pdf',
            path: 'ajanlatkeres.pdf',
          },
        ],
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          res.status(400).send(error);
        }
      });

      res.render('feedback');
    } else {
      res.render('feedback_error', {
        message:
          'Visszajelzését már továbbítottuk kollegáink felé. Köszönjük szépen szíves türelmét, amíg felvesszük önnel a kapcsolatot.',
      });
    }
  } catch (error) {
    console.error('Hiba a visszajelzésben. Frissítse újra az oldalt!');
    res.render('feedback_error', {
      message: 'Szerver hiba! Kérem frissítse újra az oldalt!',
    });
  }
});

// Only used for testing
// Sends the email based on the request's body, but doesn't add
// a new user to the database
router.post('/send-email', (req, res) => {
  console.log('Sending email...');

  const mailOptions = {
    from: 'dev.tarjanyicsanad@gmail.com',
    to: req.body.email,
    subject: 'Soltec Árajánlat',
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

import { UserType } from "../db/users";
import { PDFDocument, StandardFonts } from "pdf-lib";
import pdfkit from "pdfkit";
import fs from "fs";

export const generatePdf = async (user: UserType) => {
  const filename = `src/pdf/pdf${user.consumption.toString()}.pdf`;
  try {
    const existingBytes = fs.readFileSync(filename);

    const pdf = await PDFDocument.load(existingBytes);

    const font = await pdf.embedFont(StandardFonts.TimesRoman);

    const pages = pdf.getPages();
    const firstPage = pages[0];

    const { height } = firstPage.getSize();

    firstPage.drawText(`${user.lastName} ${user.firstName}`, {
      x: 72,
      y: height - 80,
      size: 12,
      font: font,
    });

    firstPage.drawText(
      `${user.installationLocation.zipCode} ${user.installationLocation.city}, ${user.installationLocation.street} ${user.installationLocation.houseNumber}.`,
      {
        x: 72,
        y: height - 95,
        size: 12,
        font: font,
      }
    );

    firstPage.drawText(new Date().toLocaleDateString(), {
      x: 72,
      y: height - 110,
      size: 12,
      font: font,
    });

    firstPage.drawText(`${user.firstName}!`, {
      x: 116,
      y: height - 147.5,
      size: 14,
      font: font,
    });

    const pdfBytes = await pdf.save();
    fs.writeFileSync("ajanlatkeres.pdf", pdfBytes);
  } catch (error) {
    console.error(error);
  }
};

/**
 * This is the old approach, using pdfkit
 * Under changes, will be deprecated when the new approach is ready
 * using muhammaraJS
 * @param user UserType
 */
export const createPdfDocument = (user: UserType) => {
  const doc = new pdfkit({
    size: "A4",
  });

  doc.pipe(fs.createWriteStream("ajanlatkeres.pdf"));

  doc.info = {
    Title: "Soltec ajánlatkérés",
    Author: "Author",
    Subject: "Subject",
    Keywords: "Napelem",
    CreationDate: new Date(),
    ModDate: new Date(),
  };

  doc.options.permissions = {
    printing: "highResolution",
    modifying: false,
    copying: true,
  };

  const { firstName, lastName, email, installationLocation, consumption } =
    user;
  const { zipCode, city, street, houseNumber } = installationLocation;

  doc.text(`Név: ${lastName} ${firstName}`);
  doc.text(`Email cím: ${email}`);
  doc.text(`Telepítési cím: ${zipCode} ${city} ${street} ${houseNumber}.`);
  doc.text(`Fogyasztás: ${consumption}`);

  // Finalize the pdf and end the stream
  doc.end();
};

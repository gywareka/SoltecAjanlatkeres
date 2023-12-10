import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { UserModel, UserType } from "../db/users";
import mongoose from "mongoose";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.AUTH_SECRET);
};

export const createPdfDocument = (user: UserType) => {
  const doc = new PDFDocument({
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

export async function processPriceOfferAcceptance(id: mongoose.Types.ObjectId) {
  //TODO
  try {
    const user = await UserModel.findById(id);
    user.offerAccepted = true;
    await user.save();
  } catch (error) {
    throw new Error("Error accepting the price offer");
  }
}

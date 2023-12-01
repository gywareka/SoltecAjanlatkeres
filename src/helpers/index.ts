import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.AUTH_SECRET);
};

export const createPdfDocument = () => {
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
  // Finalize the pdf and end the stream
  doc.end();
};

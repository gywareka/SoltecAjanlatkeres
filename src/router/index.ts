import express, { Request, Response, NextFunction } from "express";
import { createPdfDocument } from "../helpers";

export const router = express.Router();

// This handles the post request for the form
router.post("/", (req: Request, res: Response) => {
  console.log("[server] Form submitted");

  createPdfDocument();

  res.send(req.body);
});

router.get("/invoice", (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=soltec_ajanlatkeres.pdf",
  });
});

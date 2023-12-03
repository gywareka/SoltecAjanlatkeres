import express, { Request, Response, NextFunction } from "express";
import { createPdfDocument } from "../helpers";
import { adminRouter } from "./admin";
import { UserType, createUser } from "../db/users";

export const router = express.Router();

router.use("/admin", adminRouter);

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
    res.sendFile("ajanlatkeres.pdf");
  } catch (error) {
    res.status(400);
  }
});

router.get("/invoice", (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=ajanlatkeres.pdf",
  });
});

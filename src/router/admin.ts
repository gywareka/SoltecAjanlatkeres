import express, { NextFunction, Request, Response } from "express";

export const adminRouter = express.Router();

adminRouter.use((req: Request, res: Response, next: NextFunction) => {
  //TODO Add middleware
  console.log("Time: ", Date.now());
  next();
});

adminRouter.get("/", (req: Request, res: Response) => {
  res.render("admin");
});

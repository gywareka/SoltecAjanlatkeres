import express, { Request, Response } from "express";
import { createAdmin, getAdminsByEmail } from "../db/admin";
import { authentication, random } from "../helpers";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const existingAdmin = await getAdminsByEmail(email);
    if (existingAdmin) {
      res.sendStatus(400);
    }

    const salt = random();
    const admin = await createAdmin({
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(admin);
  } catch (error) {
    console.warn(error);
    return res.sendStatus(400);
  }
};

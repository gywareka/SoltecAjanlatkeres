import crypto from "crypto";
import { UserModel } from "../db/users";
import mongoose from "mongoose";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.AUTH_SECRET);
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

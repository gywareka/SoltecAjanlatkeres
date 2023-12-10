import mongoose from "mongoose";

export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  installationLocation: {
    zipCode: number;
    city: string;
    street: string;
    houseNumber: number;
  };
  consumption: number;
}

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  installationLocation: {
    zipCode: { type: Number, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: Number, required: true },
  },
  consumption: { type: Number, required: true },
  offerAccepted: { type: Boolean, default: false },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUsersByEmail = (email: string) => UserModel.findOne({ email });

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

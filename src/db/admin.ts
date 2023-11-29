import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  authentication: {
    salt: { type: String, required: true, select: false },
    password: { type: String, required: true, select: false },
  },
});

export const AdminModel = mongoose.model("Admin", AdminSchema);

export const getAdmins = () => AdminModel.find();

export const getAdminsByEmail = (email: string) =>
  AdminModel.findOne({ email });

export const getAdminById = (id: string) => AdminModel.findById(id);

export const createAdmin = (values: Record<string, any>) =>
  new AdminModel(values).save().then((admin) => admin.toObject());

export const deleteAdminById = (id: string) =>
  AdminModel.findOneAndDelete({ _id: id });

export const updateAdminById = (id: string, values: Record<string, any>) =>
  AdminModel.findByIdAndUpdate(id, values);

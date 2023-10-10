import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { IAddress, IUser } from "./interfaces";

interface IAddress1N extends IAddress {
  user: ObjectId;
}

const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Users = mongoose.model("Users", UserSchema);

const AddressSchema = new mongoose.Schema<IAddress1N>({
  user: {
    type: ObjectId,
    required: true
  },
  title: {
    type: String,
    default: "main"
  },
  street: {
    type: String,
    required: true
  },
  number: Number,
  complement: String,
  city: {
    type: String,
    required: true
  },
  state: String,
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Addresses = mongoose.model("Addresses", AddressSchema);
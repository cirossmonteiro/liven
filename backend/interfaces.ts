import { Request } from "express";
import { ObjectId } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface IAddress {
  title: string;
  street: string;
  number?: number;
  complement?: string;
  city: string;
  state?: string;
  country: string;
  zipCode: string;
}

export interface RequestAuthenticated extends Request {
  user: string;
}
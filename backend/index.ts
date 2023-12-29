import cors from 'cors';
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from 'express';
import joi from "joi";
import jwt from "jsonwebtoken";

import db from './db';
import { IAddress, IUser, RequestAuthenticated } from './interfaces';
import { Addresses, Users } from './schemas';

dotenv.config();

// const PORT = Number(process.env.PORT);
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;


const app = express();

app.use(cors());
 
app.use(express.json());

/* AUTHENTICATION */

// source code from https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  await db();
  const authHeader = req.headers['authorization']; // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any, data: any) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const user: any = await Users.findOne({ username: data.username });
        if (user) {
          (req as any).user = user._id;
          next();
        } else {
          console.log(36, data.username, await Users.find().lean());
          res.status(401).send("User doesn't exist.");
        }
      }
    });
  } else {
    res.sendStatus(401);
  }
}

// DONE
app.post("/users/login", async (req: Request, res: Response) => {
  await db();
  const { error, value } = joi.object<IUser>({
    username: joi.string().required(),
    password: joi.string().required()
  }).validate(req.body);
  
  if (error) {
    res.status(500).send(error);
  } else {
    const user = await Users.findOne(value);
    if (user) {
      const token = jwt.sign({ username: value.username }, TOKEN_SECRET);
      res.json({ token });
    } else {
      res.status(500).send("User not found.");
    }
  }
})

/* USERS */

// DONE
app.get("/users", authenticateToken, async (req: any, res: Response) => {
  res.json({
    ...await Users.findById(req.user).lean(),
    addresses: await Addresses.find({ user: req.user }).lean()
  })
})

// DONE
app.post("/users", async (req: Request<any, any, any, IUser>, res: Response) => {
  await db();
  const { error, value } = joi.object<IUser>({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
  }).validate(req.body);
  
  if (error) {
    res.status(500).send(error);
  } else {
    try {
      res.json(await Users.create(value));
    } catch(error) {
      res.status(500).send(error);
    }
  }
});

// DONE
app.put("/users", authenticateToken, async (req: Request, res: Response) => {
  await db();
  const { error, value } = joi.object<IUser>({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
  }).validate(req.body);
  
  if (error) {
    res.status(500).send(error);
  } else {
    try {
      res.json(await Users.findByIdAndUpdate((req as RequestAuthenticated).user, value, { new: true }));
    } catch(error) {
      res.status(500).send(error);
    }
  }
});


// DONE
app.delete("/users", authenticateToken, async (req: Request, res: Response) => {
  await db();
    try {
      const result = await Users.findByIdAndDelete((req as RequestAuthenticated).user);
      res.json(result);
    } catch(error) {
      res.status(500).send(error);
    }
});

/* ADDRESSES */

// DONE
app.post("/users/addresses", authenticateToken, async (req: Request, res: Response) => {
  await db();
  const { error, value } = joi.object<IAddress>({
    title: joi.string().required(),
    street: joi.string().required(),
    number: joi.number(),
    complement: joi.string(),
    city: joi.string().required(),
    state: joi.string(),
    country: joi.string().required(),
    zipCode: joi.string().required()
  }).validate(req.body);

  if (error) {
    res.status(500).send(error);
  } else {
    const address = await Addresses.create({
      ...value,
      user: (req as RequestAuthenticated).user
    });
    res.json(address);
  }
});

// DONE
app.get("/users/addresses/:id?", authenticateToken, async (req: Request, res: Response) => {
  await db();
  const { id } = req.params;
  if (id) {
    const address = await Addresses.findById(id);
    if (address) {
      if (address?.user.toString() === (req as RequestAuthenticated).user.toString()) {
        res.json(address);
      } else {
        res.status(403).send("Operation forbidden.");
      }
    } else {
      res.status(404).send("Address not found.");
    }
  } else {
    res.json(await Addresses.find({
      ...req.query,
      user: (req as RequestAuthenticated).user,
    }));
  }
})

// DONE
app.put("/users/addresses/:id", authenticateToken, async (req: Request, res: Response) => {
  await db();
  const { error, value } = joi.object<IAddress>({
    title: joi.string().required(),
    street: joi.string().required(),
    number: joi.number(),
    complement: joi.string(),
    city: joi.string().required(),
    state: joi.string(),
    country: joi.string().required(),
    zipCode: joi.string().required()
  }).validate(req.body);

  if (error) {
    res.status(500).send(error);
  } else {
    let address = await Addresses.findById(req.params.id);
    if (address) {
      if (address?.user.toString() === (req as RequestAuthenticated).user.toString()) {
        address = await Addresses.findByIdAndUpdate(req.params.id, value, { new: true });
        res.json(address);
      } else {
        res.status(403).send("Operation forbidden.");
      }
    }
  }
});

// DONE
app.delete("/users/addresses/:id", authenticateToken, async (req: Request, res: Response) => {
  await db();
  let address = await Addresses.findById(req.params.id);
  if (address) {
    if (address?.user.toString() === (req as RequestAuthenticated).user.toString()) {
      address = await Addresses.findByIdAndDelete(req.params.id);
      res.json(address);
    } else {
      res.status(403).send("Operation forbidden.");
    }
  } else {
    res.status(404).send("Address not found.");
  }
});

export default app;
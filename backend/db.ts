import dotenv from "dotenv";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

dotenv.config();

class DBInstance {
  db?: MongoMemoryServer = undefined;
  constructor() {
    MongoMemoryServer.create().then(db => {
      this.db = db;
    });
  }
}

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds*1000);
  });
}

const instance = new DBInstance();

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DBNAME}.mongodb.net/?retryWrites=true&w=majority`;

export default async (inMemory: boolean = true) => {
  if (inMemory) {
    while(!instance.db) {
      await sleep(1);
    }
    await mongoose.connect(instance.db.getUri());
  } else {
    await mongoose.connect(URI);
  }
}

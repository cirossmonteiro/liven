import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DBNAME}.mongodb.net/?retryWrites=true&w=majority`;

export default () => mongoose.connect(URI);
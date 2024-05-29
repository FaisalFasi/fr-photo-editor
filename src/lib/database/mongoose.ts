import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

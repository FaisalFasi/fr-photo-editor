import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";

//  MongooseConnection is a type that defines the structure of the cached object.
interface MongooseConnection {
  // conn: Stores the Mongoose connection object.
  conn: Mongoose | null;
  //   promise: Stores the promise returned by mongoose.connect. This ensures that the connection is only established once.
  promise: Promise<Mongoose> | null;
}

// This attempts to retrieve a cached Mongoose connection from the global object. If it doesn't exist, it initializes an empty object. This object is then stored in the cached variable.
let cached: MongooseConnection = (global as any).mongoose || {};

// If the cached object isn't already defined, this code initializes it with default values (conn and promise set to null).
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// This function handles the connection logic. It first checks if a connection already exists. If it does, it returns the existing connection. If not, it establishes a new connection using the MONGODB_URL environment variable.
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL)
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );

  //  The promise property is set to the result of mongoose.connect. This ensures that the connection is only established once.
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "AI-Photo-Editor",
      bufferCommands: false,
      // bufferCommands: false disables mongoose buffering. This can help prevent memory leaks in long-running applications.
    });

  cached.conn = await cached.promise;

  return cached.conn;
};

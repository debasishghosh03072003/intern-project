import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to cache the connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const globalCache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectDB(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };
    globalCache.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (err) {
    globalCache.promise = null;
    throw err;
  }

  return globalCache.conn;
}

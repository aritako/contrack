import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

global.mongoose = {
  conn: null,
  promise: null,
}

export async function dbConnect() {
  if (global.mongoose && global.mongoose.conn) {
    return global.mongoose.conn;
  } else {
    const promise = mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });

    global.mongoose = {
      conn: await promise,
      promise,
    }
    console.log('Connected to MongoDB!');

    return await promise;
  }
}
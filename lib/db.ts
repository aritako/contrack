import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI as string;

if (!URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Ensure global variable is defined for development environment
declare global {
  var _db_connection: Promise<typeof mongoose>;
}

let db_connection: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'production') {
  // In production, create a new Mongoose connection
  db_connection = mongoose.connect(URI, {
    dbName: 'documents',
  });
} else {
  // In development, reuse the global Mongoose promise
  if (!global._db_connection) {
    global._db_connection = mongoose.connect(URI, {
      dbName: 'documents',
    });
  }
  db_connection = global._db_connection;
}

export default db_connection;

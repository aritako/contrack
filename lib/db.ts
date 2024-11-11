import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI as string;
const options = {}

if (!URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient = new MongoClient(URI, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'production') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(URI, options).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In development, ensure the client is only created once.
  if (!global._mongoClientPromise) {
    client = new MongoClient(URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export default clientPromise;
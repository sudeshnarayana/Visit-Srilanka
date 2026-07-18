import { MongoClient } from "mongodb";

/**
 * Falls back to a syntactically-valid but unreachable URI when
 * MONGODB_URI isn't set, so importing this module never throws at build
 * or render time (the MongoClient constructor only parses the string —
 * it doesn't connect). The failure instead happens lazily, the first time
 * something actually awaits a query, with a clear connection error rather
 * than crashing every page that imports lib/api/*.
 */
const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/visit-sri-lanka-not-configured";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // Reuse the client across module reloads in dev so hot-reload doesn't
  // open a new connection pool on every save.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

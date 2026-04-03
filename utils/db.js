// utils/db.js

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error(
        "⚠️ MONGO_URI not found. Add it in Vercel Environment Variables."
    );
}

// Global caching (important for Vercel)
let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cached.promise = client.connect().then((client) => {
            return client;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase();
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client = new MongoClient(uri);
let db;

export async function connectToDatabase() {
  client = await client.connect();
  db = client.db("auth");

  return { db, client };
}

export async function insertDocument(collection, document) {
  try {
    await connectToDatabase();
  } catch (error) {
    return { success: false, message: "Connecting to the database failed!" };
  }

  let result;

  try {
    result = await db.collection(collection).insertOne(document);
    client.close();
  } catch (error) {
    return { success: false, message: "Inserting data failed!" };
  }

  return { success: true, ...result };
}

export async function getAllDocuments(collection, sort, filter = {}) {
  try {
    await connectToDatabase();
  } catch (error) {
    return { success: false, message: "Connecting to the database failed!" };
  }

  let documents;

  try {
    documents = await db
      .collection(collection)
      .find(filter)
      .sort(sort)
      .toArray();
    client.close();
  } catch (error) {
    return { success: false, message: "Fetching data failed!" };
  }

  return { success: true, documents: documents };
}

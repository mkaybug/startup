const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');    // Change this to whatever name you want i.e. 'startup'
const entryCollection = db.collection('entry');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

async function addEntry(entry) {
  const result = await entryCollection.insertOne(entry);
  return result;
}

function getTable() {
  const query = {};
  const cursor = entryCollection.find(query);
  return cursor.toArray();
}

module.exports = { addEntry, getTable };
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
var bodyParser = require('body-parser');
async function Predictive(){
const uri = "mongodb+srv://dawidskoczyk:qnw2yamzo26C3asK@youngdevelopers.vww82.mongodb.net/?retryWrites=true&w=majority&appName=YoungDevelopers";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect to the "NormalBase" database and access its "NormalData" collection
    const database = client.db("Final01");
    const collection = database.collection("predictedTest2");
    const result = await collection.find({}, {date: 1, predicted_count: 1}).sort({date:1}).toArray();
    console.log('predict', result);
    return result;
  } catch (error) {
    console.error('Błąd podczas wstawiania dokumentu:', error);
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
let res = run().catch(console.dir);
return res;
}
module.exports = {Predictive}
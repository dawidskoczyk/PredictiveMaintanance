const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
var bodyParser = require('body-parser');
async function mainoo(){
const uri = "mongodb+srv://dawidskoczyk:qnw2yamzo26C3asK@youngdevelopers.vww82.mongodb.net/?retryWrites=true&w=majority&appName=YoungDevelopers";
const temp = [];
const time = [];
const documents = [];
const filePath = "./Temp_data.txt";

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
    const database = client.db("temperature_db");
    const collection = database.collection("temperature_datas");
    const result = await collection.find({}, {value: 1, date: 1}).sort({date:-1}).limit(100).toArray();
    // Insert the defined document into the "NormalData" collection
    //const result = await collection.insertMany(documents);
    // Print the ID of the inserted document
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
module.exports = {mainoo}
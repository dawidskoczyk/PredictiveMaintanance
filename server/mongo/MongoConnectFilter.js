const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
var bodyParser = require('body-parser');

function dynamicImport() {
  ({ sd, ed } = require("../api.js"));
  console.log(`1.startdata ${sd}, enddata ${ed}`);
}

async function mainFilter(){


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
    dynamicImport();
    console.log(`2.startdata ${sd}, enddata ${ed}`);
    
    const database = client.db("Cluster001");
    const collection = database.collection("TestData");
    const query = {
      date: {
          $gte: sd,
          $lte: ed
      }
  };
    const result = await collection.find(query, {value: 1, date: 1}).sort({date:-1}).toArray();
    // Insert the defined document into the "NormalData" collection
    //const result = await collection.insertMany(documents);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result}`);
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

module.exports = {mainFilter}
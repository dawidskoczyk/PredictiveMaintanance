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
    const database = client.db("Cluster001");
    const collection = database.collection("tests01");
    const result = await collection.find({}, {value: 1, date: 1}).sort({date:-1}).limit(12).toArray();
    // Insert the defined document into the "NormalData" collection
    //const result = await collection.insertMany(documents);
    // Print the ID of the inserted document
    return result;
    console.log(`A document was inserted with the _id: ${result}`);
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
// fs.readFile(filePath, 'utf8', (err, data) => {
//   if (err) {
//       console.error('Błąd podczas odczytu pliku:', err);
//       return;
//   }
//   const lines = data.split('\n');
//   lines.forEach(element => {
//     const [dateTime, temperaturePart] = element.split('-');
//     const tempEl = temperaturePart.split(' ')[2];
//     temp.push(tempEl);
//     time.push(dateTime);
//   });
//   for (let i = 0; i < temp.length; i++) {
//     documents.push({
//      temp: temp[i],
//      time: time[i]
//    });
//   }
//   console.log('Documents:', documents);

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  
// });
module.exports = {mainoo}
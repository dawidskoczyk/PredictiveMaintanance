const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dawidskoczyk:qnw2yamzo26C3asK@youngdevelopers.vww82.mongodb.net/?retryWrites=true&w=majority&appName=YoungDevelopers";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect to the "insertDB" database and access its "haiku" collection
    const database = client.db("NormalBase");
    const haiku = database.collection("NormalData");
    
    // Create a document to insert
    const doc = {
      item: "exampleItem",
      timestamp: new Date()
    }
    // Insert the defined document into the "haiku" collection
    const result = await haiku.insertOne(doc);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
     // Close the MongoDB client connection
    await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);
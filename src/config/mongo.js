const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://doe-db-user:mangarosa@doe-db-cluster0.ptzpqs9.mongodb.net/doe-db-1?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
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
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

// async function connectToMongo() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1);
//   }
// }

// module.exports = { client, connectToMongo };
module.exports = { client, run };
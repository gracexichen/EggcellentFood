const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
  
app.use(cors());
app.use(express.json());
  
app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
    });

const credentials = '<path_to_certificate>';
  
const client = new MongoClient('mongodb+srv://eggcellentfood.4pvgzkk.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
    sslKey: credentials,
    sslCert: credentials,
    serverApi: ServerApiVersion.v1
});
  
async function run() {
    try {
      await client.connect();
      const database = client.db("testDB");
      const collection = database.collection("testCol");
      const docCount = await collection.countDocuments({});
      console.log(docCount);
      // perform actions using client
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}
  
run().catch(console.dir);
  
  
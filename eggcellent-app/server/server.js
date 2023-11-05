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



const url = "mongodb+srv://eggcellentfooduser:BOLPUZVzT63d7AjY@EggcellentFood.4pvgzkk.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(url);
async function run() {
    try{
        await client.connect();
        console.log('connection connected..')
        const result = await client.db("Recipes").collection("Recipe Table 1").findOne({});
        console.log(result)
        
    } catch(e){
        console.error(e);
    } finally {
        await client.close()
    }
    }
run().catch(console.dir);

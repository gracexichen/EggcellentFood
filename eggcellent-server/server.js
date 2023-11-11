const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
  

//establish a server who listens and responds through http requests
app.use(cors());
app.use(express.json());
app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
    });


//set up client to connect to mongodb
const url = "mongodb+srv://eggcellentfooduser:BOLPUZVzT63d7AjY@EggcellentFood.4pvgzkk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);


async function searchRecipes(ingrdList) { //returns recipes contaning ALL ingredients in the ingrdlist, but may include other ingredients
    try{

        await client.connect();
        console.log('connected to cluster..')
        let query = { ingredientsList : { $all : ingrdList } };
        const result = await client.db("Recipes").collection("Recipe Table 1").find(query);
        for await (const doc of result) {
            console.dir(doc);
          }   

    } catch(e){
        console.error(e);
    } finally {
    }
    }


async function searchCondition(searchTerm) { //takes search term and returns possible (autocompleted), valid conditions
    try{

        let suggestions = []
        await client.connect();
        console.log('connected to cluster..')
        let query = [{ $search: {
            "autocomplete": {
                "query": searchTerm,
                "path": "condition",
                "tokenOrder": "any",
            }
         } }];
        const result = await client.db("Conditions").collection("Conditions Table 1").aggregate(query);
        for await (const doc of result) {
            suggestions.push(doc.condition);
          }
        console.log(suggestions)
        return JSON.stringify({ searchSuggestions: suggestions });
        
    } catch(e){
        console.error(e);
    } finally {
    }
    }


async function searchIngredient(searchTerm) { //takes search term and returns possible (autocompleted), valid ingredients
    try{

        let suggestions = [];
        await client.connect();
        console.log('connected to cluster..')
        let query = [{ $search: {
            "autocomplete": {
                "query": searchTerm,
                "path": "ingredient",
                "tokenOrder": "any",
            }
         } }];
        const result = await client.db("Ingredients").collection("Ingredients Table 1").aggregate(query);
        for await (const doc of result) {
            //console.dir(doc);
            suggestions.push(doc.ingredient);
          }
        console.log(suggestions)
        return JSON.stringify({ searchSuggestions: suggestions });

    } catch(e){
        console.error(e);
    } finally {
    }
    }


//Testing searches on mongodb~
// searchRecipes(["milk", "sugar"]).catch(console.dir);
// searchCondition("sugar").catch(console.dir);
// searchIngredient("eg").catch(console.dir);


function appendIngredient(ingredient) {
    ingrdList.push(ingredient)
    return JSON.stringify({ ingrdList: ingrdList });
}

function clearIngredients() {
    ingrdList = []
}

function appendFilter(filter) {
    console.log(filter)
    filters.push(filter)
    return JSON.stringify({ filters: filters });
}

function removeFilter(filter) {
    const index = filters.indexOf(filter);
    if (index > -1) {
    filters.splice(index, 1);
    }
    return JSON.stringify({ filters: filters });
}

let ingrdList = [];
let filters = [];

app.post("/ingrd-search", (req, res) => {
    (async () => {
        res.json(await searchIngredient(req.body.searchTerm))
    })();
});

app.post("/ingrd-add", (req, res) => {
    (async () => {
        res.json(await appendIngredient(req.body.ingredient))
    })();
});

app.post("/ingrd-clear", (req, res) => {
    (async () => {
        clearIngredients()
        res.json()
    })();
});

app.post("/cndtion-search", (req, res) => {
    (async () => {
        res.json(await searchCondition(req.body.searchTerm))
    })();
});

app.post("/cndtion-add", (req, res) => {
    (async () => {
        res.json(await appendFilter(req.body.filter))
    })();
});

app.post("/cndtion-remove", (req, res) => {
    (async () => {
        res.json(await removeFilter(req.body.filter))
    })();
});

//close mongodb connection
client.close()
console.log('ended connection to cluster..')
const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxzfl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        console.log('connect to database');

        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({})
            console.log(cursor);
            const result = await cursor.toArray()
            res.json(result)
        });

        // get single service
        app.get("/services:id", async (req, res) => {
            const id = req.params.id;
            console.log('getting specified service', id);
            const query = ({ _id: ObjectId(id) });
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }


}
run().catch(console.dir)





app.listen(port, () => {
    console.log("listening on port", port);
});

// username: mydbuser2
// pass: tEzA9rX4DchRQTUR
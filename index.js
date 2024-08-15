const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccm0dfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const productCollection = client.db("ShopEaseDB").collection("products");

    // Products API
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
      const totalProducts = await productCollection.countDocuments();
      const products = await productCollection
        .find()
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send({
        totalProducts,
        products,
      });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;

      try {
        // Ensure the ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid product ID" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);

        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Product not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error retrieving product", error });
      }
    });

    app.patch("/products/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: item.name,
          image: item.image,
          description: item.description,
          price: item.price,
          category: item.category,
          rating: item.rating,
        },
      };
      const result = await productCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ShopEase is sitting");
});

app.listen(port, () => {
  console.log(`ShopEase boss is sitting on port ${port}`);
});

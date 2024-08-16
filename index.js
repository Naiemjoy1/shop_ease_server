const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopease-scic.web.app",
      "https://shopease-scic.firebaseapp.com",
      "https://shop-ease-server-amber.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

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
    // await client.connect();
    const productCollection = client.db("ShopEaseDB").collection("products");

    // Products API
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
      const search = req.query.search || "";
      const sort = req.query.sort || "default";
      const brand = req.query.brand || "all";
      const category = req.query.category || "all";
      const priceRange = req.query.priceRange || "all";

      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" }; // Case-insensitive search
      }

      if (brand !== "all") {
        query.brand = brand;
      }

      if (category !== "all") {
        query.category = category;
      }

      if (priceRange !== "all") {
        if (priceRange === "low") {
          query.price = { $lte: 50 };
        } else if (priceRange === "mid") {
          query.price = { $gt: 50, $lte: 100 };
        } else if (priceRange === "high") {
          query.price = { $gt: 100 };
        }
      }

      const totalProducts = await productCollection.countDocuments(query);

      const sortOptions = {};
      if (sort === "price-low-high") {
        sortOptions.price = 1;
      } else if (sort === "price-high-low") {
        sortOptions.price = -1;
      } else if (sort === "date-newest") {
        sortOptions.createdAt = -1;
      }

      const products = await productCollection
        .find(query)
        .sort(sortOptions)
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send({
        totalProducts,
        products,
      });
    });

    // get product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;

      try {
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

    app.post("/products", async (req, res) => {
      const item = req.body;
      const result = await productCollection.insertOne(item);
      res.send(result);
    });

    // delete product by id
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // patch product by id
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
    // await client.db("admin").command({ ping: 1 });
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

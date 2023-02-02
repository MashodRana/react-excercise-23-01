const express = require("express");
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const { query } = require("express");
const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2o6q0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database connection successful.");
    const database = client.db("test-react");

    const sectorCollection = database.collection('sectors');

    // Get all sectors
    app.get("/sectors", async (req, res) => {
      const cursor = sectorCollection.find({});
      const sectors = await cursor.toArray();
      return res.json(sectors);
    });

    // Check user is admin
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

    //  // Add user as admin
    //  app.put('/users/admin', async (req, res) => {
    //   const email = req.body?.email;
    //   const filter = { email: email };
    //   const options = { upsert: true };
    //   const updateDoc = { $set: { role: 'admin' } };
    //   const result = await userCollection.updateOne(filter, updateDoc);
    // })

    // Add user as admin
    app.put('/users/admin', async (req, res) => {
      const email = req.body?.email;
      const filter = { email: email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    })

    // Save user to the database
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });


    const productsCollection = database.collection("products");

    // Get all products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      return res.json(products);
    });

    // Get a products
    app.get("/products/:productId", async (req, res) => {
      const productId = req.params?.productId;
      const query = { _id: ObjectId(productId) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    })

    // Add a new product
    app.post('/products/add-product', async (req, res) => {
      const product = req.body;
      if (product) {
        product.rating = 0;
        const cursor = await productsCollection.insertOne(product);
        res.json({ message: 'Product successfully added.' });
      }

    })

    // Delete a prodcut
    app.delete('/products/:productId', async (req, res) => {
      const productId = req.params?.productId;
      const query = { _id: ObjectId(productId) };
      const cursor = await productsCollection.deleteOne(query);
      res.json({ message: 'Product successfullly removed.' });
    })

    // -------------------- Order table ------------------

    const ordersCollection = database.collection("orders");
    // Place a order.
    app.post("/order", async (req, res) => {
      const order = req.body;
      // console.log(order);
      order.status = "pending";
      const cursor = await ordersCollection.insertOne(order);
      res.json({
        message: "your order successfully placed. We will notify you soon.",
      });
    });

    // Cancel an order
    app.delete("/order", async (req, res) => {
      const orderId = req.body?.orderId;
      const cursor = await ordersCollection.deleteOne({ _id: ObjectId(orderId) });
      res.json({ message: 'Your order successfully canceled. Please visit our store to find your product.' });
    });

    // Get all orders for an email.
    app.get("/orders", async (req, res) => {
      const email = req.query?.email;
      if (email) {
        const query = { email: email };
        const cursor = ordersCollection.find(query);
        const orders = await cursor.toArray();
        res.json(orders);
      }
      else {
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.json(orders);

      }
    });

    // Update an order
    app.put('/orders/:orderId', async (req, res) => {
      const orderId = req.params?.orderId;
      const query = { _id: ObjectId(orderId) };
      const cursor = await ordersCollection.findOne(query);
      let message = "";
      if (cursor.status === 'shipped') {
        message = "Already shipped!!!";
      }
      else {
        const options = { $set: { status: 'shipped' } }
        const cursor2 = await ordersCollection.updateOne(query, options);
        message = "Product shipped."
      }

      res.json({ message: message });

    });

    //------------------- Reviews------------------------
    const reviewCollections = database.collection('reviews');

    // Get all reviews
    app.get('/reviews', async (req, res) => {
      const reviews = await reviewCollections.find({}).toArray();
      res.json(reviews);
    })

    // add a review
    app.post('/review', async (req, res) => {
      const review = req.body;
      const reviews = await reviewCollections.insertOne(review);
      res.json({ message: 'Your review successfully posted.' });
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to the MR Watch House Server!!!");
});

app.listen(port, () => {
  console.log("Server listening at port ", port);
});

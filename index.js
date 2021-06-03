const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

app.get("/", function (req, res) {
	res.send("Hello world!");
});

const uri =
	"mongodb+srv://Ahsan:ahsan47@cluster0.yh060.mongodb.net/EatingHouse?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	console.log("Database connected");

	const ProductCollection = client
		.db("EatingHouse")
		.collection("products");
	const CartCollection = client.db("EatingHouse").collection("Cart");
	// perform actions on the collection object

	// post new product:

	app.post("/addNewProduct", (req, res) => {
		console.log(req.body);
		ProductCollection.insertOne(req.body).then((result) => {
			console.log(result);
		});
	});

	// get product by category:
	app.get("/getProduct", (req, res) => {
		ProductCollection.find({}).toArray((arr, documents) => {
			console.log(documents);
			res.send(documents);
		});
	});

	// post Cart Item

	app.post("/addToCart", (req, res) => {
		CartCollection.insertOne(req.body);
	});

	// Get Cart product

	app.get("/getCartProducts", (req, res) => {
		CartCollection.find({}).toArray((arr, documents) => {
			res.send(documents);
		});
	});

	// Update Cart Quantity:
	app.patch("/updateQuantity/:id", (req, res) => {
		CartCollection.updateOne(
			{ _id: ObjectId(req.params.id) },
			{
				$set: {
					productQuantity: req.body.productQuantity,
				},
			}
		).then((result) => {
			res.send(result.modifiedCount !== 0);
		});
	});

	// Delete a product from cart Items:
	app.delete("/itemDelete/:id", (req, res) => {
		CartCollection.deleteOne({
			_id: ObjectId(req.params.id),
		}).then((result) => {
			res.send(result.deletedCount > 0);
		});
	});

	// Post Product:
	app.post("/orders", (req, res) => {
		console.log(req.body);
	});

	// client.close();
});

app.listen(5000);

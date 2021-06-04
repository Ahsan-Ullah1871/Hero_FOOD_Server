const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

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
});

app.listen(process.env.PORT || port);

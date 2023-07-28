// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./models/productsModel');
const app = express();
const port = 3000;


mongoose.connect('mongodb://0.0.0.0:27017/productDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("db connected");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Show product list
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a new product
app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/new', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price });
    await product.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: 'Failed to create the product' });
  }
});

// Update an existing product
app.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('edit', { product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the product' });
  }
});

app.post('/edit/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, description, price });
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: 'Failed to update the product' });
  }
});

// Delete a product
app.post('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the product' });
  }
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

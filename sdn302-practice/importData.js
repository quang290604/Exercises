const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Parse MongoDB $oid và $date từ file JSON
const parseExtendedJSON = (filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData, (key, value) => {
    if (value && typeof value === 'object') {
      if (value.$oid) return new mongoose.Types.ObjectId(value.$oid);
      if (value.$date) return new Date(value.$date);
    }
    return value;
  });
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Import');

    await Customer.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const customers = parseExtendedJSON('./customers.json');
    const products = parseExtendedJSON('./products.json');
    const orders = parseExtendedJSON('./orders.json');

    await Customer.insertMany(customers);
    await Product.insertMany(products);
    await Order.insertMany(orders);

    console.log('Data successfully imported!');
    process.exit();
  } catch (error) {
    console.error('Data import failed:', error);
    process.exit(1);
  }
};

importData();
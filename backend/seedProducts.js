
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  { name: "MacBook Air M3", category: "Electronics", price: 114999, stock: 12, rating: 4.8 },
  { name: "Dell Inspiron 15", category: "Electronics", price: 62999, stock: 10, rating: 4.4 },
  { name: "HP Pavilion Laptop", category: "Electronics", price: 57999, stock: 9, rating: 4.3 },
  { name: "Lenovo ThinkPad E14", category: "Electronics", price: 74999, stock: 7, rating: 4.6 },
  { name: "iPad Air", category: "Electronics", price: 59900, stock: 14, rating: 4.7 },
  { name: "OnePlus 13", category: "Electronics", price: 69999, stock: 11, rating: 4.6 },
  { name: "Google Pixel 9", category: "Electronics", price: 79999, stock: 6, rating: 4.5 },
  { name: "Redmi Note 14", category: "Electronics", price: 17999, stock: 20, rating: 4.2 },
  { name: "Samsung 27-inch Monitor", category: "Electronics", price: 18999, stock: 13, rating: 4.4 },
  { name: "LG 4K Monitor", category: "Electronics", price: 28999, stock: 8, rating: 4.6 },
  { name: "Logitech Wireless Mouse", category: "Accessories", price: 1299, stock: 35, rating: 4.5 },
  { name: "Mechanical Keyboard", category: "Accessories", price: 3499, stock: 22, rating: 4.4 },
  { name: "Logitech Webcam", category: "Accessories", price: 4999, stock: 16, rating: 4.3 },
  { name: "USB-C Hub", category: "Accessories", price: 1999, stock: 28, rating: 4.2 },
  { name: "Anker Power Bank", category: "Accessories", price: 2499, stock: 30, rating: 4.5 },
  { name: "JBL Bluetooth Speaker", category: "Accessories", price: 3999, stock: 18, rating: 4.4 },
  { name: "Sony Wireless Earbuds", category: "Accessories", price: 8999, stock: 12, rating: 4.6 },
  { name: "Apple AirPods", category: "Accessories", price: 12900, stock: 15, rating: 4.7 },
  { name: "Laptop Backpack", category: "Accessories", price: 1599, stock: 25, rating: 4.1 },
  { name: "Laptop Stand", category: "Accessories", price: 1199, stock: 32, rating: 4.3 },
  { name: "Office Desk", category: "Furniture", price: 9999, stock: 5, rating: 4.4 },
  { name: "Ergonomic Office Chair", category: "Furniture", price: 12499, stock: 7, rating: 4.6 },
  { name: "Bookshelf", category: "Furniture", price: 5499, stock: 9, rating: 4.2 },
  { name: "Standing Desk", category: "Furniture", price: 18999, stock: 4, rating: 4.5 },
  { name: "Study Table", category: "Furniture", price: 4499, stock: 11, rating: 4.1 },
  { name: "LED Desk Lamp", category: "Home", price: 999, stock: 24, rating: 4.3 },
  { name: "Air Purifier", category: "Home", price: 8999, stock: 8, rating: 4.5 },
  { name: "Robot Vacuum Cleaner", category: "Home", price: 19999, stock: 6, rating: 4.4 },
  { name: "Electric Kettle", category: "Home", price: 1499, stock: 21, rating: 4.2 },
  { name: "Coffee Maker", category: "Home", price: 3999, stock: 13, rating: 4.4 },
  { name: "Smart Watch Pro", category: "Wearables", price: 14999, stock: 10, rating: 4.5 },
  { name: "Fitness Band", category: "Wearables", price: 2999, stock: 19, rating: 4.1 },
  { name: "Digital Camera", category: "Electronics", price: 45999, stock: 5, rating: 4.6 },
  { name: "Action Camera", category: "Electronics", price: 24999, stock: 7, rating: 4.4 },
  { name: "Portable SSD 1TB", category: "Accessories", price: 7999, stock: 14, rating: 4.7 },
  { name: "External Hard Drive 2TB", category: "Accessories", price: 5999, stock: 12, rating: 4.4 },
  { name: "Wi-Fi 6 Router", category: "Electronics", price: 4999, stock: 16, rating: 4.3 },
  { name: "Laser Printer", category: "Electronics", price: 12999, stock: 6, rating: 4.2 },
  { name: "Drawing Tablet", category: "Electronics", price: 6999, stock: 9, rating: 4.5 },
  { name: "Gaming Controller", category: "Accessories", price: 4499, stock: 17, rating: 4.4 },
];

async function seedProducts() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/shopsmart"
    );

    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
      const result = await Product.updateOne(
        { name: product.name },
        {
          $setOnInsert: {
            ...product,
            isActive: true,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }

    const total = await Product.countDocuments();

    console.log(`New products added: ${inserted}`);
    console.log(`Existing products skipped: ${skipped}`);
    console.log(`Total products in collection: ${total}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();

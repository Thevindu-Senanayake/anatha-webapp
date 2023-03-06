import Product from "../models/product";
import dotenv from "dotenv";
import connectDatabase from "../config/database";
import products from "../data/products.json";

// Setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedProducts = async (): Promise<void> => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("All Products are added.");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedProducts();

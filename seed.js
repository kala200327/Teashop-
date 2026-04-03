const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  // Tea
  {
    name: "Classic Masala Chai",
    price: 15,
    category: "tea",
    image: "/images/masala.avif"
  },
  {
    name: "Green Tea with Honey",
    price: 20,
    category: "tea",
    image: "/images/green.webp"
  },
  {
    name: "Herbal Special",
    price: 25,
    category: "tea",
    image: "/images/my-herbal.jpg"
  },
  {
    name: "Normal Tea",
    price: 10,
    category: "tea",
    image: "/images/normaltea.jpg"
  },
  {
    name: "Ginger Lemon Tea",
    price: 22,
    category: "tea",
    image: "/images/gingertea.avif"
  },
  {
    name: "Oolong Tea",
    price: 25,
    category: "tea",
    image: "/images/oolongtea.jpg"
  },
  // Coffee
  {
    name: "Cappuccino",
    price: 120,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Iced Latte",
    price: 150,
    category: "coffee",
    image: "/images/caramel latte coffee.jpg"
  },
  {
    name: "Filter Coffee",
    price: 90,
    category: "coffee",
    image: "/images/filter coffee.jpg"
  },
  {
    name: "Vennila Coffee",
    price: 80,
    category: "coffee",
    image: "/images/vennila coffee.jpg"
  },
  {
    name: "Mocha Frappe",
    price: 160,
    category: "coffee",
    image: "/images/mocha coffee.webp"
  },
  {
    name: "Irish Coffee",
    price: 140,
    category: "coffee",
    image: "/images/irish coffee.webp"
  },
  // Snacks
  {
    name: "Medu Vada",
    price: 12,
    category: "snacks",
    image: "/images/medu vada.jpg"
  },
  {
    name: "Bajji",
    price: 15,
    category: "snacks",
    image: "/images/bajji.jpg"
  },
  {
    name: "Samosa",
    price: 20,
    category: "snacks",
    image: "/images/samosa.jpg"
  },
  {
    name: "Bonda",
    price: 10,
    category: "snacks",
    image: "/images/bonda.jpg"
  },
  {
    name: "Curd Vada",
    price: 15,
    category: "snacks",
    image: "/images/curd.webp"
  },
  {
    name: "Athirasam",
    price: 15,
    category: "snacks",
    image: "/images/athirasam.webp"
  }
];

const seedDatabase = async () => {
  try {
    console.log('Using MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    const deleteResult = await Product.deleteMany();
    console.log('Deleted products count:', deleteResult.deletedCount);
    
    const insertResult = await Product.insertMany(sampleProducts);
    console.log('Inserted products count:', insertResult.length);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

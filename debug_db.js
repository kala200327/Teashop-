const mongoose = require('mongoose');
require('dotenv').config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Using URI:', process.env.MONGODB_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        const Product = mongoose.model('Product', new mongoose.Schema({ name: String, category: String }));
        const products = await Product.find({});
        console.log('Total Products:', products.length);
        console.log('Categories:', [...new Set(products.map(p => p.category))]);
        console.log('Sample Names:', products.map(p => p.name).slice(0, 5));
        console.log('Oolong exists?', products.some(p => p.name === 'Oolong Tea'));
        console.log('Masala exists?', products.some(p => p.name === 'Masala Tea'));
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();

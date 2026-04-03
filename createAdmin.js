const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@teashop.com';
    const adminPassword = 'adminpassword'; // Change this mapping as needed

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      existingAdmin.role = 'admin'; // ensure role is set
      await existingAdmin.save();
      console.log('Admin role ensured for:', adminEmail);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = new User({
      username: 'storeadmin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log(`Admin user created successfully! \nEmail: ${adminEmail} \nPassword: ${adminPassword}`);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/teashop')
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await mongoose.connection.db.collection('users').updateOne(
      { email: 'test@example.com' },
      { $set: { password: hashedPassword } }
    );
    console.log('Password reset successfully');
    process.exit();
  })
  .catch(console.error);

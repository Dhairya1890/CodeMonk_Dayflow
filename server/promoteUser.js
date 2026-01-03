require('dotenv').config();
const sequelize = require('./db');
const User = require('./models/User');

async function promoteToAdmin(email) {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log(`❌ User with email '${email}' not found`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`✓ User '${user.name}' is already an admin`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`✓ Successfully promoted '${user.name}' (${email}) to admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node promoteUser.js <email>');
  console.log('Example: node promoteUser.js john@example.com');
  process.exit(1);
}

promoteToAdmin(email);

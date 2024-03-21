const User = require('../models/UserWithPagination');

const createUsers = async (req, res) => {
  try {
    const users = await User.create([
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Jane Smith', email: 'jane.smith@example.com' },
      // Add more users as needed
    ]);

    res
      .status(201)
      .json({ message: 'Test users created successfully', users });
  } catch (err) {
    console.error('Error creating test users:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createUsers }; // Export the createUsers function

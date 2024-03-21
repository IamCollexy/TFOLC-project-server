const User = require('../models/UserWithPagination'); // Assuming you have a User model

const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        total_pages: totalPages,
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total_users: totalUsers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = getUsers; // Correct way to export a single function
// Export the createUsers function

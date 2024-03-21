const mongoose = require('mongoose');

const userWithPaginationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
});

const UserWithPagination = mongoose.model(
  'UserWithPagination',
  userWithPaginationSchema
);

module.exports = UserWithPagination;

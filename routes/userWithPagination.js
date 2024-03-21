const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllerWithPagination');

// GET /users?page=1&limit=10
router.get('/', usersController.getUsers);

module.exports = router;

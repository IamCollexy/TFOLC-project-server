const express = require('express');
const router = express.Router();
const createUsersController = require('../controllers/createUsersController');

router.post('/', createUsersController.createUsers); // Use createUsers as middleware for POST route

module.exports = router;

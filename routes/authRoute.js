const express = require('express');
const router = express.Router();
const authController = require('../controllers/autController');

// const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);

router.route('/').post(authController.login);

module.exports = router;

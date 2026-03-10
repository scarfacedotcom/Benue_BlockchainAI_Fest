const express = require('express');
const { productShowcaseRegister } = require('../controllers/productShowcaseController');
const { registrationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();


// POST /api/product-showcase/register
router.post('/register', registrationLimiter, productShowcaseRegister);

module.exports = router;

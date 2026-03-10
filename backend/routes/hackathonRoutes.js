const express = require('express');
const { hackathonRegister } = require('../controllers/hackathonController');
const { registrationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();


// POST /api/hackathon/register
router.post('/register', registrationLimiter, hackathonRegister);

module.exports = router;

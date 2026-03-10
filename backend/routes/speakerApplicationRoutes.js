const express = require('express');
const { speakerApplicationRegister } = require('../controllers/speakerApplicationController');
const { registrationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();


// POST /api/speaker-application/register
router.post('/register', registrationLimiter, speakerApplicationRegister);

module.exports = router;

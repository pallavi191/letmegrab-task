var express = require('express');
var router = express.Router();

router.use('/emp', require('./emp'));

module.exports = router;
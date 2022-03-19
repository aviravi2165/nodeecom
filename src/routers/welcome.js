const express = require('express');
const router = new express.Router;
const path = require('path');

const publicDir = path.join(__dirname, '../../public');
router.get('/', (req, res) => {
    res.sendFile(publicDir+'/index.html');
});

module.exports = router;
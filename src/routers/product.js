const express = require('express');

const router = new express.Router;

router.get('/product',(req,res)=>{
    res.send("This is product API");
});

module.exports = router;
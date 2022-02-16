const express = require('express');

const router = new express.Router;

router.get('/order',(req,res)=>{
    res.send("this is order API");
});

module.exports = router;
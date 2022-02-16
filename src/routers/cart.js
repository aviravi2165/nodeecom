const express = require('express');
const router = new express.Router;

router.get('/cart',(req,res)=>{
    res.send("this is cart API");
});



module.exports = router;

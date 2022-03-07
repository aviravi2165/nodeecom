const mongoose = require('mongoose');

mongoose.connect(`${process.env.CONNECTIONURL}`);

const { users, userId1, userId2 } = require('./user-seeder');
const { categories, catId1, catId2 } = require('./category-seader');
const { products } = require('./product-seader');

let promisedColelctor = [];

users.forEach(user => {
    promisedColelctor.push(Promise.resolve(user.save()));
});

categories.forEach(cat => {
    promisedColelctor.push(Promise.resolve(cat.save()));
});

products.forEach(prd => {
    promisedColelctor.push(Promise.resolve(prd.save()));
});

Promise.all(promisedColelctor)
.then((res) => console.log("Seeds Entered"))
.catch(err => console.log(err.message));



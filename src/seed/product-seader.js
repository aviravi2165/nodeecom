const Product = require('../models/product');
const { catId1, catId2 } = require('./category-seader');
const { userId1, userId2 } = require('./user-seeder');

const products = [
    new Product({
        name: "Apple iPhone 7",
        price: "25000",
        discount: "0",
        rating: "4.5",
        categoryId: catId2,
        description: "64GB/1GB",
        uom: "Nos",
        tax: "18",
        owner: userId1
    }),
    new Product({
        name: "Apple iPhone 12",
        price: "50000",
        discount: "0",
        rating: "5",
        categoryId: catId2,
        description: "265GB/3GB",
        uom: "Nos",
        tax: "18",
        owner: userId2
    }),
    new Product({
        name: "Adidas Shoe",
        price: "5000",
        discount: "0",
        rating: "3",
        categoryId: catId1,
        description: "8No/Sports",
        uom: "Nos",
        tax: "18",
        owner: userId1
    }),
    new Product({
        name: "Levis Jeans",
        price: "25000",
        discount: "0",
        rating: "4",
        categoryId: catId1,
        description: "Rugged/34in",
        uom: "Nos",
        tax: "18",
        owner: userId2
    })
];

module.exports = { products };
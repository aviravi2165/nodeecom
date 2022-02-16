const mongoose = require('mongoose');

mongoose.connect(`${process.env.connectionURL}/${process.env.databaseName}`);
const mongoose = require('mongoose');

mongoose.connect(`${process.env.CONNECTIONURL}/${process.env.DATABASENAME}`);
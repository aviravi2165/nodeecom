const mongoose = require('mongoose');
mongoose.connect(`${process.env.CONNECTIONURL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
exports.start = new Promise(async (resolve, reject) => {
    const mongoose = require('mongoose');
    const Appster = require('./models/AppsterModel');

    mongoose.connect('mongodb://localhost:27017/appster', {autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
    var AppsterModel = await Appster.init(mongoose);

    resolve(AppsterModel);
})

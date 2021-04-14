// Load the module dependencies:
//  config.js module and mongoose module
var config = require('./config'),
    mongoose = require('mongoose');
// Define the Mongoose configuration method
module.exports = function () {
    // Use Mongoose to connect to MongoDB
    const db = mongoose.connect(config.db, {
		useUnifiedTopology: true,
		useNewUrlParser: true, useCreateIndex: true 
		}).then(() => console.log('Databse is now connected'))
		.catch(err => {
		console.log('Error');
		});

    // Load the models
    require("../app/models/clinicalvisit.server.model");
    require("../app/models/dailyinfo.server.model");
    require("../app/models/emergencyalert.server.model");
    require("../app/models/user.server.model");
    
    // Return the Mongoose connection instance
    return db;
};
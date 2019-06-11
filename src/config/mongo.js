const mongoose = require('mongoose');
const key = 'mongodb://localhost/blogspot';

mongoose.connect(key, { useNewUrlParser: true, useFindAndModify: false });
// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// mongoose.connection.once('open', () => console.log('db connected'));

module.exports = mongoose;
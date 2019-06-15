const server = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('./config/mongo'); // mongo configuration
const router = require('./routes/index');
const allowHttpRequests = require('./middlewares/http-request');

const PORT = process.env.PORT || 3000;

// view engine
server.set('view engine', 'ejs');
server.set('views', __dirname + '/views');

// static files
server.use(require('express').static(__dirname + '/public'));

// middlewares
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cookieParser());

// header middleware allow html request
server.use(allowHttpRequests);

// routes
server.use(router);

server.listen(PORT, () => console.log(`Server is listening in 127.0.0.1:${PORT}`));
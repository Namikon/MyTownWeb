/**
 * (c) 2019 Namikon
 * Based on:
 *
 * Node.js Login Boilerplate
 * More Info : https://github.com/braitsch/node-login
 * Copyright (c) 2013-2018 Stephen Braitsch
 **/
const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

const config = require('./app/server/modules/config.js');
const app = express();

app.locals.pretty = true;
app.set('port', gConfig.node_port);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));


if (config.environment === 'development'){
    process.env.DB_URL = 'mongodb://' + gConfig.mongo_db_server + ':' + gConfig.mongo_db_port;
}	else {
// prepend url with authentication credentials //
    process.env.DB_URL = 'mongodb://' + gConfig.mongo_db_server + ':' + gConfig.mongo_db_username + '@' + gConfig.mongo_db_password + ':' + gConfig.mongo_db_port;
}

app.use(session({
        secret: gConfig.session_secret,
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ url: process.env.DB_URL })
    })
);

require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
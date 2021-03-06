if (process.env.NODE_ENV === 'prod') {
    require('babel-polyfill');
}

// import the env
import env from './utils/envHandler';
import dbHandler from './utils/dbHandler';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import logger from 'morgan';
import helmet from 'helmet';
import passport from 'passport';
import { abc } from './modules/chats/Handler';


// Common imports
import bodyParser from 'body-parser';
import express from 'express';
const app = express();
const server = require('http').createServer(app);
// when env is dev, log via morgan
if (process.env.NODE_ENV === 'dev') {
    app.use(logger('dev'));
}

// Use helmet
app.use(helmet());

// parsing req/res body to json
app.use(bodyParser.json({ limit: '50mb' }));

// for parsing the url encoded data using qs library
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



// CORS Support
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    //recs.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, auth-token, Content-Type, Content-Range, Content-Disposition, Content-Description');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,content-type,Authorization,auth-token,Accept"
    );
    next();
});

app.use(require('express-session')({
    secret: 'keyboard dog',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Load the routes
routes(app);

require('./middlewares/passport')(passport);


// adding err handling middleware, this is a post-call middleware
errorHandler(app);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
//   });

// open db connection before server starts
dbHandler.openConnection().then((db_details) => {
    console.log(`Db is connected to ${db_details.db.s.databaseName}`);
    // start server on port
    server.listen(env().PORT, () => {
        console.log(`server listening on ${env().PORT} `);
    });
}, (err) => {
    console.log('error in opening the connection', err);
});

abc(server);



// kill process when Ctrl+C is hit
process.on('SIGINT', () => {
    dbHandler.closeConnection(() => {
        console.log('bye bye !');
        process.exit();
    });
});
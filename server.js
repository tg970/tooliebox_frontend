// DEPENDENCIES
const express    = require('express');
const session    = require('express-session');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
// const cors 			 = require('cors');
const app        = express();
require('pretty-error').start();

// CONFIG
const PORT       = process.env.PORT || 3030;
const mongoURI   = process.env.MONGODB_URI || 'mongodb://localhost/tooliebox'
const doingwork    = process.env.TOOLSYO || 'd0ingWork'

// Connect to Mongo
mongoose.connect ( mongoURI , { useMongoClient: true});
const db = mongoose.connection;
db.on( 'error', ( err ) => console.log( err.message + ' is Mongod running?' ));
db.on( 'connected', () => console.log( 'Mongo OK: ', mongoURI ));
db.on( 'disconnected', () => console.log( 'Mongo Disconnected' ));
mongoose.Promise = global.Promise;

// Controllers
// const placeController = require( './controllers/placeController' );
//const userController = require( './controllers/userController' );
//const sessionController = require( './controllers/sessionController' );
// const quoteController = require( './controllers/quoteController' );

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static( 'public' ));
app.use(morgan('dev'));
// app.use(cors());
app.use(session({
	 secret: doingwork,
	 resave: false,
	 saveUninitialized: false
}));
//app.use('/places', placeController );
//app.use('/users', userController );
//app.use('/sessions', sessionController);
//app.use('/quote', quoteController);

app.get('/:whatever', (req, res) => res.redirect('/'))

app.listen(PORT, () => {
   console.log('Server OK: ' + PORT);
});

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connect = process.env.MONGODB_URI;
const User = require('./models/models').User;
const cors = require('cors');
const compression = require('compression');
const CryptoJS = require("crypto-js");

const REQUIRED_ENV = "SECRET MONGODB_URI".split(" ");

REQUIRED_ENV.forEach(function(el) {
  if (!process.env[el]){
    console.error("Missing required env var " + el);
    process.exit(1);
  }
});

mongoose.connect(connect);
mongoose.Promise = global.Promise;

const models = require('./models/models');

//put in dbRoutes
const dbGeneralRoutes = require('./routes/dbRoutes/dbGeneralRoutes');
const dbGetRoutes = require('./routes/dbRoutes/dbGetRoutes');
const dbSaveRoutes = require('./routes/dbRoutes/dbSaveRoutes');
const dbUpdateRoutes = require('./routes/dbRoutes/dbUpdateRoutes');
const awsRoutes = require('./routes/awsAccess');
const auth = require('./routes/authorization');
const emailRoutes = require('./routes/email');
const app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
app.use(cookieParser());
//IF WE NEED TO SERVE SOME FILES (stylesheets, scripts, etc.), USE THIS:
// app.use(express.static(path.join(__dirname, 'public')));

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header 
    return false
  }

  // fallback to standard filter function 
  return compression.filter(req, res)
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, *");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));

const mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'user-sessions',
  });

// Passport
app.use(session({
  secret: process.env.SECRET,
  store: mongoStore,
  resave: true
  // userToken: null
}));

app.use(function(req, res, next) {
  console.log('use function', req.session, req.session.userMToken, req.user);
  if(req.user) {
    next()
  }
  if (req.session.userMToken) {
    // const mongoIdByte = CryptoJS.AES.decrypt(req.session.userMToken.toString(), 'secret');
    // const mongoId = mongoIdByte.toString(CryptoJS.enc.Utf8);
    User.findById(req.session.userMToken)
        .then((response) => {
          // console.log(response);
          req.user = response;
          next()
        })
  } else {
    req.user = undefined;
    next();
  }
});


app.post('/auth/logout', function(req, res) {
    console.log('hit destroy');
    mongoStore.destroy(req.session.id, function() {
      req.session.destroy();
      req.user = undefined;
      console.log('req.user logout', req.user);
      res.json({success:true});
    })
  });

app.use('/auth', auth);
app.use('/db', dbGeneralRoutes);
app.use('/db/get', dbGetRoutes);
app.use('/db/save', dbSaveRoutes);
app.use('/db/update', dbUpdateRoutes);
app.use('/aws', awsRoutes);
app.use('/email', emailRoutes);
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use('/', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'build/index.html')); // For React/Redux
});

// app.get('/', (req, res, next) => {
//     if (req.user) {
//         console.log('this should not be seen on the backend and should only take care of /login');
//         console.log('req.user', req.user);
//         if (req.user.currentCommunity) {
//             console.log('YES');
//             User.findById(req.user._id)
//                 .populate('currentCommunity')
//                 .then((user) => {
//                     const url = '/community/' + user.currentCommunity.title.split(' ').join('') + '/discover';
//                     console.log('MORE');
//                     res.redirect(url);
//                 })
//         }
//         else {
//             console.log('BET');
//             res.redirect('/walnuthome')
//         }
//     }
//     else {
//         response.sendFile(path.join(__dirname, '..', 'build/index.html'));
//     }
// });


// make this dbRoutes when we have the database running


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started. Listening on port %s', port);

module.exports = app;

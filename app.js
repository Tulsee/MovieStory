const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//load user Models
require('./models/user')

// passport config
require('./config/passport')(passport);

const app = express();

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//load keys
const keys = require('./config/keys');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connecct
mongoose.connect(keys.mongoURI)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log('err'));


//middleware for handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


//passport middle ware
app.use(passport.initialize());
app.use(passport.session());

//set global variable
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//use routes
app.use('/', index); 
app.use('/auth', auth);




const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
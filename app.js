const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//load  Models
require('./models/user')
require('./models/Story');

// passport config
require('./config/passport')(passport);

const app = express();

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//load keys
const keys = require('./config/keys');

//handlebars helper
const {
    truncate,
    stripTags,
    formatDate, 
    select,
    editIcon
} = require('./helpers/hbs');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connecct
mongoose.connect(keys.mongoURI)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log('err'));

//middle ware for body- parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//middleware for method override
app.use(methodOverride('_method')); 


//middleware for handlebars
app.engine('handlebars', exphbs({
    helpers:{
        truncate: truncate,
        stripTags: stripTags,
        formatDate:formatDate,
        select: select,
        editIcon:editIcon
    },
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

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);




const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
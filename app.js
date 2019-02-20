const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');

// passport config
require('./config/passport')(passport);

const app = express();

//load routes
const auth = require('./routes/auth');


//middleware for handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) =>{
    res.render('index');
});

//use routes
app.use('/auth', auth);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
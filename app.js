let express=require('express');
let app=express();
let bcrypt = require("bcryptjs");
let router = express.Router();
let flash = require('connect-flash');
let path = require("path");
let bodyParser = require("body-parser");
let cookieParser=require('cookie-parser');
let hbs = require("express-handlebars");
let expressValidator = require("express-validator");
let port = process.env.PORT||  5000;
let passport = require("passport");
let session = require('express-session');
let mongoose = require("mongoose");

mongoose.connect('mongodb+srv://shekhar:Shekhar1@sample-bmyhc.mongodb.net/sample?retryWrites=true&w=majority');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we are connected");
});
 

app.use(expressValidator());

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser());
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


let routes = require('./routes/index');
let signup = require('./routes/signup');
let myaccount=require("./routes/my_account");
let login=require('./routes/login');

app.use(express.static(__dirname + '/public'));
app.use(flash());
app.engine('hbs', hbs({ extname: 'hbs',defaultLayout:'layout',layoutsDir: __dirname + '/view/layouts/' }));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'hbs');

app.get('*',function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user||null;
    res.locals.cart = req.session.cart ;
    next();
});


app.use('/', routes);
app.use('/', signup);
app.use('/',login);
app.use('/',myaccount);

app.listen(port,function(err){
    if(err){
        console.log(err)
    }
    console.log('connected');
});
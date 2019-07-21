let express = require('express');
let app = express();
let bcrypt=require("bcryptjs");
let router = express.Router();
var JSAlert = require("js-alert");
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let User = require('../models/user');
let sess;
router.get('/signup', (req, res, err) => {
   
    if (err) {
        console.log(err)
    }
    res.render('signup')

});

router.post('/signup', (req, res, err) => {
    if (err) {
        console.log(err);
    }
    let username = req.body.username;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let mobile = req.body.mobile;
    let dateofbirth = req.body.dateofbirth;
    let password = req.body.password;
   

    req.checkBody('firstname', 'firstname is required').notEmpty();
    req.checkBody('lastname', 'lastname is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('mobile', 'mobile is required').notEmpty();
    req.checkBody('dateofbirth', 'dateofbirth is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
   
    var errors=req.validationErrors();
    if(errors){
        res.render('signup',{
            // console.log("yes")
           errors:errors
       });
    }
    else{
        User.findOne({username:username},function (err,user) {
            if(err){
                console.log(err)
            }
            if(user){
                console.log("user already exist");
                req.flash('error_msg','Username exist already.Try another username.');
                res.redirect('/signup')
            }
          /* else if(email){
                console.log("email already exist");
                req.flash('error_msg', 'Email exist already.Try another email.');
                res.redirect('/register')
            }*/
            else{
                let user = new User({
                    firstname:firstname,
                    lastname:lastname,
                    username: username,
                    email: email,
                    mobile: mobile,
                    
                    password: password,
                    dateofbirth:dateofbirth


                });
                bcrypt.genSalt(10,function(err,salt){
                    if(err){
                        console.log(err)
                    }
                    bcrypt.hash(user.password,salt,function(err,hash){
                        if(err){
                            console.log(err)
                        }
                        user.password=hash;
                        user.save(function(err){
                            if(err){
                                console.log(err)
                            }
                            else {
                                req.flash('success_msg', 'U are registerd. Please Login!');
                                console.log('u r registed');
                                //res.redirect('/signup');
                                res.redirect('/login');
                            }
                        });
                    });
                });
            }
        });
    }
});

router.get('/login',function(req,res){
    if(res.locals.user){
        res.redirect("/")
    }
        res.render('login')
    
});

router.post('/',function(req,res,next){
    passport.authenticate('local',{
        
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
   
});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', "You are logged out");
    //console.log("u r logged out");
    res.redirect('/');
    
});

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',
    passport.authenticate('google',{successRedirect:'/',failureRedirect:'/signup'})
);

router.get('/auth/facebook',
     passport.authenticate('facebook', { scope: ['email'] })
    
    );
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/myaccount', failureRedirect: '/signup' })
    
);

module.exports = router;  
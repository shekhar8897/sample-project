let LocalStrategy=require("passport-local").Strategy;
let User=require("../models/user");
let bcrypt=require('bcryptjs');
let GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
let facebookStrategy=require('passport-facebook').Strategy;
let configAuth=require('./auth');

module.exports=function(passport)
{
    passport.use(new LocalStrategy(function (username,password,done) {
        User.findOne({username:username},function(err,user){
            if(err){
                console.log(err)
            }
            if(!user){
                return done(null,false,{message:'No user found'});
            }
            bcrypt.compare(password,user.password,function (err,isMatch) {
                if(err){
                    console.log(err)
                }
                if(isMatch){
                    return done(null,user)
                }
                else{
                    return done(null,false,{message:'wrong password'});
                }
            });
        });
    }));

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user)
        });
    });


    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientId,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({ 'google.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user)
                    {    console.log("Profile name is"+profile.name.givenName);
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.username = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                         newUser.google.firstname=profile.name.givenName;
                         newUser.google.lastname=profile.name.familyName;
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        })
                        console.log(profile);
                    }
                });
            });
        }
    ));


    passport.use(new facebookStrategy({
        clientID: configAuth.facebookAuth.clientId,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user)
                    {
                         return done(null, user);
                    }
                       
                    else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.displayName ;
                        newUser.facebook.email = profile.email[0].value;
                        newUser.facebook.password = profile.password;
                        // newUser.facebook.mobile=profile.mobile;
                        // newUser.facebook.dateofbirth=profile.dateofbirth;
                        newUser.save(function() {
                            return done(null, newUser);
                        })
                        console.log(profile);
                    }
                });
            });
        }
    ));

}

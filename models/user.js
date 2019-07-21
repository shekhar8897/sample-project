let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        //required: true
    },
    lastname: {
        type: String,
       // required: true
    },
    username: {
        type: String,
        index: true
       // required:true
    },
    email: {
        type: String,
        index:true
       // required: true
    },
    password: {
        type: String
        //required: true
    },
    dateofbirth: {
        type: String
       // required: true
    },
   mobile:{
       type:Number,
   },

   google:{
       id:String,
       token:String,
       email:String,
       firstname: String,
       lastname: String,
       username:String
   },

facebook:{
         id: String,
        password: String,
        token: String,
        email: String
       
    }
});

let User = module.exports = mongoose.model('User', UserSchema);

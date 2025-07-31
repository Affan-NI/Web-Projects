const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type: String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); // yhe automatic username, hashing, salting, and hashPassword create karega.

module.exports = mongoose.model('User', userSchema);

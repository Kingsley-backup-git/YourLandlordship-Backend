const validator = require('validator');

const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const AuthSchema = new Schema({
email : {
    type : String,
    required : true,
    unique : true
},
password : {
    type : String,
    required:true
},
accountType: {
type:String,
enum : ["tenant", "landlord"]
    },

},{ timestamps: true })

AuthSchema.statics.signup = async function(email, password) {

if(!email || !password) {
throw Error("Email or Password is required")
}
if(!validator.isEmail(email)) {
    throw Error("email is invalid")
}
if (!validator.isStrongPassword(password)) {
  throw Error("password not strong  enough")
}
    const findEmail = await this.findOne({email})

if(findEmail) {
    throw Error("email already exist")
}
const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password, salt)
const user = await this.create({email, password:hash})
return user
}



AuthSchema.statics.login = async function(email, password) {

if(!email || !password) {
throw Error("Email or Password is required")
}
if(!validator.isEmail(email)) {
    throw Error("email is invalid")
}
if (!validator.isStrongPassword(password)) {
  throw Error("password not strong  enough")
}
    const findEmail = await this.findOne({email})
    if(!findEmail) {
    throw Error("Invalid email or password")
}
const comparePassword = await bcrypt.compare(password, findEmail.password)


if(!comparePassword) {
    throw Error("Incorrect Password")
}

return findEmail
}


AuthSchema.statics.resetPassword = async function (email, password) {
if(!email) {
  
    throw   Error("Email is required")
}
if(!password) {

    throw Error("Password is required")
}

if(!validator.isStrongPassword(password)) {
      throw Error("password not strong  enough")
}

const findEmail = await this.findOne({email})
if(!findEmail) {
  throw Error("User not found")
}
const salt = await bcrypt.genSalt(10)
const hash = await  bcrypt.hash(password, salt)
findEmail.password = hash;
await findEmail.save()
return findEmail
}

module.exports = mongoose.model("AuthCollection", AuthSchema)
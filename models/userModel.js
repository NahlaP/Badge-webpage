// requiring mongoose
const mongoose = require("mongoose") 

//creating a schema
const userSchema = mongoose.Schema({   

  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  }, 
  mobile:{
    type:Number,
    required:true
  },
  // image:{
  //   type:String,
  //   required:true
  // },
  password:{
    type:String,
    required:true 
  },
  is_admin:{
    type:Number,
    required:true
  },
  is_verified:{
    type:Number,
    default:0
  }
})


//collection name will be User in plural form
module.exports = mongoose.model("User",userSchema); 

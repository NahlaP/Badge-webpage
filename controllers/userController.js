//requiring model file
const User = require('../models/userModel');

//requiring bcrypt
const bcrypt = require('bcrypt');




const securePassword = async(password)=>{
  try {
    const passwordHash = await bcrypt.hash(password,10)
    return passwordHash;

  } catch (error) {
    console.log(error.message);
  }
}



//register function
const loadRegister = async(req,res)=>{
  //creating async await method as db operations involve i/o operations
  try{
    res.render('registration')

  }catch(error){
    console.log(error.message);
  }
}

const insertUser = async(req,res)=>{
//creating async await method as db operations involve i/o operations
  try {

    const spassword = await securePassword(req.body.password);
    const user = new User({      
      name:req.body.name,    // using body-parser middleware
      email:req.body.email,
      mobile:req.body.mobile,   
      // image:req.file.filename,
      password:spassword,
      is_admin:0
    });

    //returning a promise  
    const userData = await user.save();  //saving data to mongo db

    if(userData){

      res.render('registration',{message:"Your registration is successful."});
    }
    else{
      res.render('registration',{message:"Your registration has failed."});
    }

  } catch (error) {
    console.log(error.message);
  }
}
 


//login function 
const loadLogin = async(req,res)=>{
  //creating async await method as db operations involve i/o operations
  try{
    res.render('login')

  }catch(error){
    console.log(error.message);
  }
}



const verifyLogin = async(req,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;

     const userData = await User.findOne({email:email});  

     if(userData){ 
      const passwordMatch = await bcrypt.compare(password,userData.password)
//authentication of user
      if (passwordMatch) {

        req.session.user_id = userData._id; 
        res.redirect('/home');

      } else {
        res.render('login',{message:'Email and password is incorrect'})
      }
     } 
     else{
      res.render('login',{message:'Email and password is incorrect'})
     }

  } catch (error) {
    console.log(error.message);
  }
}



//Home page function ith user data
// const loadHome = async (req,res)=>{
//   try {

//     const userData = await User.findById({_id:req.session.user_id})

//     res.render('home',{user:userData});

//   } catch (error) {
//     console.log(error.message);
//   }
// }
const loadHome=async(req,res)=>{
  try {
         const userData=  await  User.findById({ _id:req.session.user_id })
         if(userData){
          res.render('home',{user: userData })
         }else{
             req.session.destroy()
             res.redirect('/')
         }
      
  } catch (error) {
      console.log(error.message);
  }
}

//logout function
const userLogout = async(req,res)=>{
try {
  req.session.user_id=null
  res.redirect('/')

} catch (error) {
  console.log(error.message);
}
}

// user profile edit function
const editProfile = async (req,res)=>{
  try { 
    const id = req.query.id;   //getting id from url using query
    const userdata = await User.findById({_id:id});
    
    if(userdata){
      res.render('edit',{user:userdata});
    }
    else{
      res.redirect('/home');
    }
  } catch (error) {
   console.log(error.message); 
  }
}

//updating the changes
const updateProfile = async (req,res)=>{
  
  try {
    console.log("working1");
   const name = req.body.name,email = req.body.email,mobile = req.body.mno; 
  
   const userdata = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:name,email:email,mobile:mobile} })
    console.log(userdata);
   res.redirect('/home')

  } catch (error) {
    console.log(error.message);
  }
}


module.exports ={
    loadRegister,
    insertUser ,
    loadLogin ,
    verifyLogin, 
    loadHome,
    userLogout,
    editProfile,
    updateProfile
    
}
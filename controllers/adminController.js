//requiring model file
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

//random string for password
// const randomstring = require('randomstring');


//for secure password
const securePassword= async(password)=>{
  try {
    const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;

  } catch (error) {
    console.log(error.message);
  }
}




//admin login page
const loadLogin = async(req,res)=>{
try {
  res.render('login');

} catch (error) {
  console.log(error.message)
}
}

//admin data post
const verifyLogin = async (req,res)=>{
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({email:email})
  
    if(userData){
      console.log(userData);
        const passwordMatch = await bcrypt.compare(password,userData.password);
     
          if(passwordMatch){
          console.log(passwordMatch);
            if(userData.is_admin===0){
              
              res.render('login',{message:"Email and password incorrect"})
            }
            else{
              req.session.admin_id = userData._id;
              res.redirect("/admin/home")

            }
          }
          else{
            res.render('login',{message:"Email and password incorrect"})
          }
      }
    else{
      res.render('login',{message:"Email and password incorrect"})
    }

  } catch (error) {
    console.log(error.message);
  }
}


//dashboard
const loadHome = async (req,res)=>{
  try {
    
    const userData = await User.findById({_id:req.session.admin_id});
    res.render('home',{admin:userData});

  } catch (error) {
    console.log(error.message);
  }
}



// logout function
const logout = async(req,res)=>{
  try {
    req.session.admin_id=null
    res.redirect('/admin');

  } catch (error) {
    console.log(error.message);
  }
}


//dashboard function
const admDashboard = async(req,res)=>{
  
 try {

  var search = '';
  if(req.query.search){
    search = req.query.search;
  }
  const fullUserdata = await User.find({is_admin:0,
  $or:[
    {name:{$regex:'.*'+search+'.*',$options:'i'}},
    {email:{$regex:'.*'+search+'.*',$options:'i'}}
    // {mobile:{$regex:'.*'+search+'.*',$options:'i'}},
   

  ]
  });


  res.render('dashboard',{users:fullUserdata});
  
 } catch (error) {
  console.log(error.message);
 }
   
}


//function for new user loading
const newUserload = async(req,res)=>{
try {
res.render('new-user');

} catch (error) {
  console.log(error.message);
}
}


//function for updating new user value
const addUser = async(req,res)=>{
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    // const password = randomstring.generate(8);
    const password = req.body.password;
  
    const spassword =await securePassword(password);
    
    const user = new User({
      name:name,
      email:email,
      mobile:mobile,
      password:spassword,
      is_admin:0
    });

    const userData = await user.save(); 

    if (userData) {
      
      res.redirect('/admin/dashboard');

    } else {
      res.render('new-user',{message:'Some thing wrong'})

    }

  } catch (error) {
    console.log(error.message);
  }
}


//function for editing user data
const editUserload = async(req,res)=>{
  try {

    const id = req.query.id;
    const userData = await User.findById({_id:id});
    if(userData){
       res.render('edit-user',{user:userData});
    }
    else{
      res.redirect('/admin/dashboard');
    }
   
    
  } catch (error) {
    console.log(error.message);
  }
}

//function for updating edited user data
const updateUsers = async(req,res)=>{
  try {
   await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name, email:req.body.email ,mobile:req.body.mobile}});
    res.redirect('/admin/dashboard');  

  } catch (error) {
    console.log(error.message);
  }
}

//delete user function
const deleteUser = async(req,res)=>{
  try {
    const id = req.query.id;
    await User.deleteOne({_id:id}); 
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  loadLogin, 
  verifyLogin,
  loadHome,
  logout,
  admDashboard,
  newUserload,
  addUser,
  editUserload,
  updateUsers,
  deleteUser

}
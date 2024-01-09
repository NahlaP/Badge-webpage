//requiring express
const express = require("express")
const adminRoute = express();


const session = require("express-session")
const config = require('../config/config')

adminRoute.use(
  session({
    secret: config.sessionSecret, // Provide your session secret
    resave: false, // Set resave to false to prevent unnecessary session saves
    saveUninitialized: true, // Set saveUninitialized to true to save new but uninitialized sessions
  })
);



const bodyParser = require("body-parser")
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended:true}))

adminRoute.set('view engine','ejs');
adminRoute.set('views','./views/admin')


const auth = require("../middleware/adminAuth")
const adminController = require("../controllers/adminController"); //requiring userController module


//for admin login page
adminRoute.get('/',auth.isLogout,adminController.loadLogin)

adminRoute.post('/',adminController.verifyLogin);

adminRoute.get('/home',auth.isLogin,adminController.loadHome);


adminRoute.get('/logout',auth.isLogin,adminController.logout)

//for dashboard
adminRoute.get('/dashboard',auth.isLogin,adminController.admDashboard)


//for adding new user
adminRoute.get('/new-user',auth.isLogin,adminController.newUserload)


//for updating new user
adminRoute.post('/new-user',auth.isLogin,adminController.addUser)

//editing user details by admin
adminRoute.get('/edit-user',auth.isLogin,adminController.editUserload)


//updating user edits
adminRoute.post('/edit-user',auth.isLogin,adminController.updateUsers)


//deleting user bu=y admin
adminRoute.get('/delete-user',auth.isLogin,adminController.deleteUser)


//redirecting to admin for all /admin/somethingelse
adminRoute.get('*',function(req,res){
  res.redirect('/admin')
})



module.exports = adminRoute;   
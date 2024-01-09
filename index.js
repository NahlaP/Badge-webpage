//require mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/UMS"); //Establish a connection to Database
const nocache = require("nocache");

// require express
const express = require("express");
const app = express(); // create an instance for express

//using nocache
app.use(nocache());

//for user routes
const user_route = require("./routes/userRoute");
app.use("/", user_route);

//for admin route
const adminRoute = require("./routes/adminRoute");
app.use("/admin", adminRoute);

app.get('/',(req,res)=>{
  const val=req.query.name
  res.send(`hello im ${val}`)
})

//listen to port 3000
app.listen(7000, () => {
  console.log("server is Running");
});

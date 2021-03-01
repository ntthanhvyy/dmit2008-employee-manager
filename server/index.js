const fileService = require('./services/fileService')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
//import the express module
const express = require('express');
// import the path utils from Node.
const cors = require('cors')
const cookSession = require('cookie-session')

// Importing login service with login route
const loginService = require('./services/loginService')
// Importing register service with register route
const registerService = require('./services/registerService')

const app = express()
 
const PORT =  process.env.PORT || 5000 

// Middleware For Cross Origin Resource SHaring
app.use(cors())

//To get access to the name value pairs send in the message Body of POST Request.
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Session
app.use(cookSession({
  name:"session",
  keys:['SDFLU9iw2308dlsfuwe2adfl', 'LDFA34gsdfgFOPW2323DA7FS2']
}))

// Setup Template Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))

app.use(express.static(path.join(__dirname, "../client"), {extensions: ["html"]})
);

// DASHBOARD
app.get('/dashboard', (req, res)=>{
  if(req.session.isValid){
    res.render('dashboard')
  }else{
    res.redirect('/login')
  }
 })

//REGISTER
app.get('/register', (req, res)=>{
  res.render('register', {emailWarning:"", successMessage: ""})
 })

//LOGIN
app.get('/login', (req, res)=>{
  res.render('login', {passwordWarning:"", emailWarning:"", email:"", password:""})
})

app.get('/logout', (req, res)=>{
  req.session.isValid = false;
  res.render('login', {passwordWarning:"", emailWarning:"", email:"", password:""})
})

 

app.post('/login', (req, res)=>{
    const user = {
      email:req.body.email,
      password:req.body.password
    }
    const isValidUser = loginService.authenticate(user)
       //Login success
       if( isValidUser.user !== null){
             // set a session value isValid
             if(!req.session.isValid){
                 req.session.isValid = true;
             }
             res.redirect('dashboard')
       }

       //Login fail
       if(isValidUser.user === null){
           res.render('login', {
             emailWarning:isValidUser.emailWarning, 
             passwordWarning:isValidUser.passwordWarning,
             email:req.body.email,
             password:req.body.password
            })
       }
  })


// REGISTER
app.post('/register', (req, res)=>{
  const user = {
    username: req.body.username,
    email:req.body.email,
    password:req.body.password
  }
  const isValidUser = registerService.register(user)
  
  //Register fail   
  if( isValidUser.user === null){
    res.render('register',{emailWarning:"Email is already registered", successMessage: ""})
  }


  //Register success
  if(isValidUser.user !== null){
    // Update to Json
    let users = fileService.getFileContents('../data/users.json')
    users.push(user)
    users = JSON.stringify(users)
    fs.writeFileSync(path.join(__dirname, './data/users.json'), users)

    //Send success messege
    res.render('register', {emailWarning:"", successMessage: "Register succesfully"})
  }
})

app.listen(PORT, () => {
  console.log(`server started on http://localhost:5000`);
});

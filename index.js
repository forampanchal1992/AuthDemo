const express = require('express');
const app = express();
const User = require('./models/user');
const { mongoose } = require('mongoose');
const bcrypt= require('bcrypt');
const session = require('express-session');

//mongoose.connect('mongodb://localhost:27017/authDemo')
mongoose.connect('mongodb://127.0.0.1:27017/authDemo')
.then(() =>{
        console.log('MONGO CONNECTION OPEN!!!')
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err);
    })

app.set('view engine','ejs');
app.set('views','views');
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'notagoodsecret'})); 

//setup the middleware
const requireLogin= (req,res,next) => {
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    next();
}
app.get('/',(req,res) =>{
    res.send('This is home page');
})

app.get('/register',(req,res) =>{
    res.render('register');
})
app.post('/register', async(req,res) => {
    const {password,username} = req.body;
    const user = new User({username,password})
    //const hash = await bcrypt.hash(password,12);
    //save username and password in database
    // const user = new User({
    //     username,
    //     password: hash
    // })
    await user.save();
    //res.send(hash);
    //this is for storing user in session
    req.session.user_id = user._id;
    res.redirect('/');
})

app.get('/login',(req,res) =>{
    res.render('login');
})

app.post('/login',async(req,res) =>{
     const {username,password} = req.body;
    const foundUser = await User.findAndValidate({username,password});
     //const validPassword = await bcrypt.compare(password,user.password);
     if(foundUser){
        req.session.user_id = foundUser._id;
        //res.send("Yes you are welcome");
        res.redirect('/secret');
     }
     else{
        res.send("Please try again");
     }
    //res.send(req.body);
})

app.post('/logout', (req,res) => {
    req.session.user_id = null;
    //this will destory the session and will not allow to go on secret page back once you are logout.
    //req.session.destroy();
    res.redirect('/login');
})
app.get('/secret',requireLogin,(req,res) => {
    // if(!req.session.user_id){
    //    return res.redirect('/login')
    // }
    res.render('secret')
   // res.send('This is Secret! You can not see me unless you login')
})

app.get('/topsecret', requireLogin, (req,res) => {
    res.send("TOp SEcret!!!")
})

app.listen(3000, ()=>{
    console.log("Serving your app");
})
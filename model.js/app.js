require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const saltRounds = 10;
const app = express();
console.log(process.env.API_kEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/fine",{useNewUrlParser:true});
const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    regno: String,
    studentname: String,
    course: String,
    batch:String,
    date: Date,
    paymentby: String,
    paymentfor: String,
    punishments: String,
    amount: Number
})

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home")
})
app.get("/userlogin",function(req,res){
    res.render("userlogin")
})
app.get("/userregister",function(req,res){
    res.render("userregister")
})
app.get("/cashierregister",function(req,res){
    res.render("cashierregister")
})
app.get("/cashier",function(req,res){
    res.render("cashier")
})
app.get("/cashierlogin",function(req,res){
    res.render("cashierlogin")
})
app.get("/user",function(req,res){
    res.render("user");
})
app.get("/add",function(req,res){
    res.render("addpayment");
})
app.get("/cashierhome",function(req,res){
    res.render("cashierhome");
})
app.get("/logout",function(req,res){
    res.render("home");
})

app.get("/fines", function(req, res) {
    User.find({}, function(err, fines) {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
      } else {
        res.render("fines", { fines: fines });
      }
    });
  });

app.set("views", __dirname + "/views");

app.post("/userregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
        email:req.body.email,
        regno: req.body.regno,
        studentname: req.body.studentname,
        course: req.body.course,
        batch: req.body.batch,
        password:hash
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("userhome");
        }
    })
})
})
app.post("/add",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
        email:req.body.email,
        regno: req.body.regno,
        studentname: req.body.studentname,
        course: req.body.course,
        batch: req.body.batch,
        password:hash,
        date: req.body.date,
        paymentby: req.body.paymentby,
        paymentfor: req.body.paymentfor,
        punishments: req.body.punishments,
        amount: req.body.amount
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.send("Add fine successfully")
        }
    })
})
})
app.post("/cashierregister",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
        email:req.body.email,
        password:hash,
        
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("cashierhome");
        }
    })
})
})

app.post("/userlogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password
    User.findOne({email:email},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("userhome")
                }
            })
        }
     }
})
})
app.post("/cashierlogin",function(req,res){
    const email = req.body.email;
    const password = req.body.password
    User.findOne({email:email},function(err,foundUser){
     if(err){
        console.log(err)
     }
     else{
        if(foundUser){
            bcrypt.compare(password,foundUser.password,function(err,result){
                if(result===true){
                    res.render("cashierhome")
                }
            })
        }
     }
})
})
app.listen(4000,function(){
    console.log("server is started at port 4000")
})
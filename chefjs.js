import express from "express";
import {pool} from "./dbConfig.js";
import bcrypt from "bcrypt";
import session from "express-session";
import flash from "express-flash";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import pg from "pg";

import { initialize } from "./passportConfig.js";


const data = {
     
    Indian: [
        {
            id: 1,
            name: "Dal Makhani",
            price: 100,

        },
        {
            id: 2,
            name: "Butter Chicken",
            price: 200,

        },
        {
            id: 3,
            name: "Paneer Tikka",
            price: 150,

        },
        {
            id: 4,
            name: "Dosa",
            price: 100,

        },{
            id: 5,
            name: "Biryani",
            price: 100,

        },

    ],

    Chinese: [
        {
            id: 6,
            name: "Chill Chicken",
            price: 200,

        },
        {
            id: 7,
            name: "Chowmein",
            price: 100,

        },
        {
            id: 8,
            name: "Mopo Tofu",
            price: 150,

        },
        {
            id: 9,
            name: "Chinese Hot Pot",
            price: 100,

        },{
            id: 10,
            name: "Spring Rolls",
            price: 100,

        },

    ],

    Mexican: [
        {
            id: 11,
            name: "Chilaquiles",
            price: 100,

        },
        {
            id: 12,
            name: "Tamales",
            price: 200,

        },
        {
            id: 13,
            name: "Chiles en nogada",
            price: 150,

        },
        {
            id: 14,
            name: "Burritos",
            price: 100,

        },{
            id: 15,
            name: "Tacos",
            price: 200,

        },

    ],

    Italian: [
        {
            id: 16,
            name: "Gnocchi",
            price: 100,

        },
        {
            id: 17,
            name: "BLasagne",
            price: 200,

        },
        {
            id: 18,
            name: "Arancini",
            price: 150,

        },
        {
            id: 19,
            name: "Panzerotto fritto",
            price: 100,

        },{
            id: 20,
            name: "Fiorentina",
            price: 100,

        },

    ],

    French: [
        {
            id: 21,
            name: "Bouillabaisse",
            price: 100,

        },
        {
            id: 22,
            name: "Chocolate soufflé",
            price: 200,

        },
        {
            id: 23,
            name: "Crêpes",
            price: 150,

        },
        {
            id: 24,
            name: "Cassoulet",
            price: 100,

        },{
            id: 25,
            name: "Quiche Lorraine",
            price: 100,

        },

    ],

    Japanese: [
        {
            id: 27,
            name: "Sushi",
            price: 100,

        },
        {
            id: 28,
            name: "Udon",
            price: 200,

        },
        {
            id: 29,
            name: "Sashimi",
            price: 150,

        },
        {
            id: 30,
            name: "Tonkatsu",
            price: 100,

        },
        {
            id: 31,
            name: "Sukiyaki",
            price: 100,

        },

    ]

};

initialize(passport);

const app = express();
const port = process.env.port || 3000;
const saltrounds = 12;


app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');



app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized: false
    }
));

app.use(passport.session());
app.use(passport.initialize());
const db = new pg.Client({
user: process.env.DB_USER,
host: process.env.DB_HOST,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
port: process.env.DB_PORT,

});
db.connect();

app.use(flash());

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.render("register");
});
app.get("/login", checkAuthenticated,(req,res)=>{
    res.render("login");
});
app.get("/register", checkAuthenticated, (req,res)=>{
    res.render("register");
});

app.get("/for-a-meal",checkNotAuthenticated,(req,res)=>{
    res.render("for-a-meal");   
});

app.get("/cuisine",(req,res)=>{
    res.render("cuisine");
});

app.get("/booking",(req,res)=>{
    res.render("booking");
})

app.get("/logout",(req,res)=>{
    req.logout((err)=>{
 if(err)
 throw err;
 req.flash("success_msg","You have logged out");
 res.redirect("/login"); 
    });


});

app.post("/register", async (req,res)=>{
    let {name,email,password,password2} = req.body;
    console.log({name, email, password, password2});
    
    let errors = [];

    if(!name || !email || !password || !password2)
    {
        errors.push({message: "Please Enter All Fields"});
    }

    if(password!== password2)
    {
        errors.push({message: "Passwords Do not Match"});
    }

    if(password.length<6)
    {
        errors.push({message: "Password Should Be Atleast 6 Characters Long"});
    }

    if(errors.length>0)
    {
        res.render("register",{errors});
        
    }
    else{
        try{
            const checkUser = await db.query("SELECT * FROM chefusers WHERE email = $1",[email]);
            if(checkUser.rows.length>0)
            {
                errors.push({message: "Email Already Registered"});
                res.render("register",{errors});
            }
            else{
                bcrypt.hash(password,saltrounds, async(err,hashedPassword)=>{
                 if(err)
                 throw err;
                else{
                    const result = await db.query("INSERT INTO chefusers (name,email,password) VALUES($1,$2,$3) RETURNING *",[name,email,hashedPassword]);
                    const user = result.rows[0];
                    req.login(user,(err)=>{
                        req.flash("success_msg","You are Now Registered. Please Log In");
                        res.redirect("/login");
                    })
                    
                }
                })
            }
        }catch(err)
        {
            { throw err;}
        }
    }

});


app.post("/login",passport.authenticate("local",{
    successRedirect: "/for-a-meal",
    failureRedirect: "/login",
    failureFlash: true
}));
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated())
    {
       return res.redirect("/for-a-meal");
    }
    next();
}

app.post("/for-a-meal", async (req,res)=>{

    const location = req.body.location;
    let chefData;
    try{
        const chef = await db.query("SELECT * FROM chefCooks WHERE city = $1",[location]);
        console.log(chef.rows);
        chefData=chef.rows;
        res.render("for-a-meal",{chefData});
    }catch(err)
    {
        throw err;
    }
});
app.post("/booking",(req,res)=>{
    
  const selectedDishes = req.body.dish;
  const date = req.body.date;
    const numberOfPeople = req.body.people;
    const  timings = req.body.timings;
    let amount = req.body.meal_bill;

  console.log(selectedDishes);
   
    res.render("booking",{
    Menu: selectedDishes,
    bookingDate: date,
    guests: numberOfPeople,
     timing: timings,
   totalAmount: amount});  
    
});

function checkNotAuthenticated(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }

    res.redirect("/login");
}
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

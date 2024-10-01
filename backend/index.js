import express  from "express";
import cors from "cors"
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import env from "dotenv"



const app = express();
const port = 5001;
const saltRounds = 10;
env.config();

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

// Set up the app to use Session as a midleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.use(passport.initialize());
app.use(passport.session())

const db = new pg.Client({
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT
});

db.connect();

// console.log(db)
app.get("/", (req, res)=>{
    console.log(req.user)
    if(req.isAuthenticated()){
        console.log(req.user)
        res.redirect("/products")
    }else{
        res.redirect("/login")
    } 
})

app.get("/login", (req, res)=>{
  
    res.send("Please, Log in Now..!")
})

app.get("/products", async(req, res)=>{
    console.log(req.user.firstname)
    
    // res.send("Just to see if this will work")
    try {
        const products = await db.query("SELECT * FROM products")
        res.json(products.rows)
        
    } catch (error) {
        console.error("Couldn't get the products..!", error)
    }

})
 

app.post("/registration", async(req, res)=>{
    const {firstname, lastname, email, password} = req.body;
    try {
        //Vrefy if the eamil is already used for a previous registration.
        const verifyUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        // console.log(verifyUser.rows)
        if(verifyUser.rows.length> 0){
            res.send("This email is already used, try to log in.")
        }else{
            // Register the new user if the email is verified.

            ///Hashing the password
            bcrypt.hash(password, saltRounds, async (err, hash)=>{
                if(err){
                    console.log("There where an error during the regitration", err)
                }else{}
                const newUser = await db.query("INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *", 
        [firstname, lastname, email, hash]
        )

        const user = newUser.rows[0];
        req.logIn(user, (err)=>{
            console.log(err)
            res.redirect("/products")
        })
        // console.log(newUser);
        

            });
            
        }
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", 
        passport.authenticate("local", {
        successRedirect: "/products",
        failureRedirect: "/login",
    }))

passport.use( new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, cb){
    try {
        const userEmail = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if(userEmail.rows.length>0){
            const user = userEmail.rows[0];
            // console.log(user.email)
            // console.log(user.password)
            // console.log(password)
            const storedHashPassword = user.password;

            bcrypt.compare(password, storedHashPassword, (err, result)=>{
                console.log(result)
                if(err){
                    console.log(err)
                    return cb(err)
                }else{
                    if(result){
                        return cb(null, user)
                    }else{
                        return cb(null, false)
                    }
                }

            })

        }else{
            return cb("User not find..!")
        }    
    } catch (error) {
        return cb(error)
    }

})
);

passport.serializeUser((user, cb)=>{
    cb(null, user)
});
passport.deserializeUser((user, cb)=>{
    cb(null, user)
})

app.listen(port, ()=>{
    console.log(`The Server is up and running on port ${port}`)
})
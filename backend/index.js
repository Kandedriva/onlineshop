import express from "express";
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

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

// Set up the app to use Session as a midleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {
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
app.get("/login", (req, res)=>{
    if(req.isAuthenticated()){ 
        res.redirect("/products")
    }else{
        res.send("Please, Log in Now..!")
    } 
})

app.get("/products", async(req, res)=>{
        try {
        const products = await db.query("SELECT * FROM products")
        res.json({
            productsList: products.rows, 
            loggedUser: req.user
        })
        
    } catch (error) {
        console.error("Couldn't get the products..!", error)
    }

})

app.post("/registration", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        //Vrefy if the eamil is already used for a previous registration.
        const verifyUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        // console.log(verifyUser.rows)
        if (verifyUser.rows.length > 0) {
            res.redirect("/login")
            res.send("This email is already used, try to log in.")
        } else {
            // Register the new user if the email is verified.

            ///Hashing the password
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("There was an error during the regitration", err)
                } else {
                    const result = await db.query("INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *",
                        [firstname, lastname, email, hash]
                    )
                    console.log(result.rows[0])
                    const user = result.rows[0];
                    // console.log(user)
                    req.login(user, (err) => {
                        res.redirect("/products")
                    })
                }
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

passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, cb) {
    try {
        const userEmail = await db.query("SELECT * FROM users WHERE email = $1", [email])
        // console.log(userEmail)
        if (userEmail.rows.length > 0) {
            const user = userEmail.rows[0];
            const storedHashPassword = user.password;
            // console.log(user.email)

            bcrypt.compare(password, storedHashPassword, (err, result) => {
                console.log(result)
                if (err) {
                    console.log(err)
                    return cb(err)
                } else {
                    if (result) {
                        return cb(null, user)

                    } else {
                        return cb(null, false)
                    }
                }

            })

        } else {
            return cb("User not find..!")
        }
    } catch (err) {
        return cb(err)
    }

})
);
passport.serializeUser((user, done) => {
    done(null, user);
    console.log("This is from the Serialized")
});

passport.deserializeUser((user, done) => {

    done(null, user);
    console.log("This is from the deserialized")
});


app.listen(port, () => {
    console.log(`The Server is up and running on port ${port}`)
})
const express = require('express');
const mongoose= require('mongoose');
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/authenticate", )
.then(() => {
    console.log("Connected to MongoDB")
})
.catch((e) => {
    console.error("couldn't connect to MongoDB", e)
}) 

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User", userSchema)


const app = express();
const cors=require("cors")
app.use(cors())
app.use(express.json());

app.get("/",(req, res) => {
    res.send("Home Page")
}
    )
    app.get("/login",(req, res) => {
        res.send("Login Page")
    })
    app.post("/signup", (req, res) => {
        const { name, email, number, password } = req.body;
          new User({
             name:name, 
             email:email, 
             number:number, 
             password:password 
            }) .save()
            .then(() =>  res.status(201).json({message : "User registered successfully"}))

            .catch(() => res.status(400).json({ error: "user already exists" }));

    });
    app.post("/login", (req, res) => {
        const { email, password } = req.body;
        User.findOne({ email, password })
            .then(user => {
                if (user) {
                    res.status(200).json({ message: "Login successful" });
                } else {
                    res.status(401).json({ message: "Invalid email or password" });
                }
            })
            .catch(e => {
                console.error(e);
                res.status(500).json({ message: "Error during login" });
            });
    });

    app.listen(4000)


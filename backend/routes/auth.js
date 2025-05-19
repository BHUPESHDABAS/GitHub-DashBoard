import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import passport from "passport";
const router = express.Router();
import User from "../models/user.js";

//Local Signup
router.post("/signup", async(req,res) =>{
    try {
        const {name, email, password} = req.body;
        const checkUser = await User.findOne({email});
        if(checkUser) return res.status(400).json({message: "User already exists, try another E-mail"});

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashPassword});
        await newUser.save();

        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({ message: "Backend Service error (signup)", error });
    }
});

//Local Login
router.post("/login", async(req,res) =>{
    try {
        const {email, password} = req.body;
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.status(400).json({message: "User not found"});

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if(!checkPassword) return res.status(400).json({message: "Incorrect password"});

        const token = jwt.sign({id: checkPassword._id}, process.env.JWT_KEY, {expiresIn: "1d"});

        res.status(200).json({token, checkUser, message:"Login Successfull"});
    } catch (error) {
        res.status(500).json({ message: "Backend Service error (login)", error });
    }
});

// //Google Login
// var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:4444/auth/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// router.get('/google',
//     passport.authenticate('google', { scope:
//         [ 'email', 'profile' ] }
// ));
  
// router.get( '/google/callback',
//       passport.authenticate( 'google', {
//           successRedirect: '/auth/google/success',
//           failureRedirect: '/auth/google/failure'
// }));



export default router;
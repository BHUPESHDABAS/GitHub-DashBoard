import dotenv from "dotenv";
dotenv.config();

import express from "express";
// import cors from "cors";
import mongoose from "mongoose";
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

import authRoute from "./routes/auth.js"
app.use("/auth", authRoute);

import gitRoute from "./routes/github.js";
app.use("/github", gitRoute);

mongoose.connect(`${process.env.DB_PATH}/${process.env.DB_NAME}`)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Connected");
            console.log("http://localhost:" + PORT);
        })
    })
    .catch(err => {
        console.log(err);
    })

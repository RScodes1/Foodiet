const express = require('express');

require("dotenv").config();

const app = express();
const {connection} = require("./config/db");

app.get('/',(req,res)=>{
    res.send({msg : "hello world"});
})


app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("connected to mongodb");
        console.log(`successfully connected to port http://localhost:${process.env.port}`);
    } catch (error) {
         console.log(error);
    }
})
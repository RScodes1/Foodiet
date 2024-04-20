const express = require('express');
require("dotenv").config();


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express")

const app = express();
const {connection} = require("./config/db");
const {userRouter} = require('./routes/user.routes');

app.use("/",userRouter);

app.get('/',(req,res)=>{
    res.send({msg : "hello world"});
})

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User Management World',
        version: '1.3.0',
      },
      servers:[
        {
          url:"http://localhost:8080/"
        },
        {
          url:"http://wwww.example.com"
        }
      ]
    },
    apis: ['./routes/*.js'], 
};
const openapiSpecification = swaggerJsdoc(options);

app.use('/apidocs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("connected to mongodb");
        console.log(`successfully connected to port http://localhost:${process.env.port}`);
    } catch (error) {
         console.log(error);
    }
})
const express = require('express');

const userRouter = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const {UserModel} = require("../model/user.model");


userRouter.post('/api/register', async(req,res)=>{
    const {username, email, password} = req.body;
    try {
        const existinguser = await UserModel.findOne({email});
        if(existinguser){
            res.status(500).json({msg: "user already registered"})
        } else {
             bcrypt.hash(password, 8, async(err, hash)=>{
                  if(err){
                    res.status(502).json({msg: "error hashing password"});
                  } else if(hash){
                      const user = new UserModel({username, email, password : hash});
                      await user.save();
                      res.status(201).json({msg: "user registered successfully"});
                  }
             })
        }
    } catch (error) {
        console.log("error", error);
    }
})

userRouter.post('/api/login',async(req,res)=>{
    const {email, password} = req.body;

       try {
        const existinguser1 = await UserModel.find({email});
        if(!existinguser1){
            res.status(500).json({msg : "user doesnt exist"});
        } else {
            bcrypt.compare(existinguser1.password, password, (err, result)=>{
                if(err){
                 res.status(500).json({msg : "password not matched"});
                } else if(result){
                    const token  = jwt.sign(existinguser1._id, "masai");
                    res.status(200).json({msg : "user login sucessfully"}, token);
                }
            })
        }
       } catch (error) {
        console.log("error",error);
       }
})

userRouter.patch('api/user/:id/reset', async(req,res)=>{
      const {email, newpassword} = req.body;
      try {
        const existinguser3 = await UserModel.find({email});
        if(!existinguser3){
            res.status(500).json({msg : "user doesnt exist"});
        } else {
           const update = await UserModel 
        } 
      } catch (error) {
        
      }
})
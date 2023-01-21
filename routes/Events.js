const User = require('../models/User')
const express =require('express')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Router=express.Router()
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const JWT= "Login@userToken"

//creating user
Router.get('/getAllEvents',
fetchuser,async (req,res)=>{
    
    
})
Router.post('/PostEvent',fetchuser,
async(req,res)=>{
  

}
)

module.exports= Router
const User = require('../models/User')
const express =require('express')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Router=express.Router()
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const JWT= "Login@userToken"
const Events = require('../models/Events');
//getting events
Router.get('/getAllEvents',async (req,res)=>
{
    try {
        const Event = await Events.find();
        res.send(Event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//postingEvents
Router.post('/PostEvent',fetchuser,[
    body('EventName', 'Enter a valid EventName').isLength({ min: 1 }),
    body('Description', 'Description must be atleast 20 characters').isLength({ min: 20 }),
    body('ParticipantsNumber', 'Description must be atleast 5 characters').isNumeric({min:1})
],
async(req,res)=>{
    try {
        const{EventName,Desc,ParticipantNumber}=req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const Event = new Events({
            EventName, Desc, ParticipantNumber
        })
        const savedEvent = await Event.save()
        res.json(savedEvent);
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
}
)

module.exports= Router
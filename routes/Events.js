const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const JWT = "Login@userToken";
const Events = require("../models/Events");
const { deleteOne, remove, findByIdAndDelete } = require("../models/User");

//getting events
Router.get("/getAllEvents", async (req, res) => {
  try {
    const Event = await Events.find();
    res.send(Event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//postingEvents
Router.post(
  "/PostEvent",
  fetchuser,
  [
    body("EventName", "Enter a valid EventName").isLength({ min: 1 }),
    body("desc", "Description must be atleast 20 characters").isLength({
      min: 2,
    }),
    body("np", "Participants must be a numeric value").isNumeric(),
    body(
      "npremaining",
      "participants remaning must be a numeric value"
    ).isNumeric(),
  ],
  async (req, res) => {
    try {
      const { CreatorID, EventName, desc, np, npremaining } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const Event = new Events({
        EventName,
        desc,
        np,
        npremaining,
        CreatorID,
      });
      const savedEvent = await Event.save();
      res.json(savedEvent);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

//postEventJoinRequest
Router.post(
  "/EventJoinRequest",
  fetchuser,
  [
    body("EventID", "Enter a valid EventID")
      .isLength({ min: 1 })
      .isAlphanumeric(),
    body("UserID", "Enter a valid UserID")
      .isLength({ min: 1 })
      .isAlphanumeric(),
  ],
  async (req, res) => {
    try {
      const { EventID, UserID } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const event = await Events.findById(EventID);
      if (event.np) {
        const newuserreq = event.UserRequested.filter((ele) => {
          return ele.UserID.toString() === UserID;
        });
        console.log(newuserreq);
        if (newuserreq.length === 0) {
          event.UserRequested.push({
            UserID,
          });
          const savedEvent = await event.save();
          res.send(savedEvent);
        } else {
          res.status(404).json({
            code: 1,
            message: "User already exists in the database",
          });
        }
      } else {
        res.status(201).json({
          code: 2,
          message:
            "Maximum number of participants is already reached for this event",
        });
      }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);
//postRequestResponse
Router.post(
  "/RequestResponse",
  fetchuser,
  [
    body("EventID", "Enter a valid EventID")
      .isLength({ min: 1 })
      .isAlphanumeric(),
    body("UserID", "Enter a valid UserID")
      .isLength({ min: 1 })
      .isAlphanumeric(),
    body("Response", "Enter a valid Response").isBoolean(),
  ],
  async (req, res) => {
    try {
      const { EventID, UserID, Response } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const event = await Events.findById(EventID);
      if (Response) {
        const newuserreq = event.UserAccepted.filter((ele) => {
          return ele.UserID.toString() === UserID;
        });
        if (newuserreq.length === 0) {
          event.UserAccepted.push({
            UserID,
          });
          const savedEvent = await event.save();
          res.json({
            code:0,
            message:"The user is accpeted for the given Event",
            result:savedEvent
          });
        } else {
          res.status(404).json({
            code: 1,
            message: "The user is already accepted for the given event",
          });
        }
      }
      else{
        res.status(404).json({
          code: 1,
          message: "User the rejected for the given event",
        });
      }
      const newuserreq = event.UserRequested.filter((ele) => {
        return ele.UserID.toString() === UserID;
      });
      if (newuserreq.length !== 0) {
        event.UserRequested = event.UserRequested.filter((ele) => {
          return ele.UserID.toString() !== UserID;
        });
        const savedEvent = await event.save();
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);


//Delete Event

Router.post("/deleteEvent",fetchuser,[
  body("EventID", "Enter a valid EventID")
  .isLength({ min: 1 })
  .isAlphanumeric(),
],async (req,res)=>{
    const {EventID}=req.body
    const event= await Events.findByIdAndDelete(EventID);
    res.json({
      code:0,
      message:"Event is successfully deleted",
    })
})
module.exports = Router;

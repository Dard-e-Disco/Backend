const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const JWT = "Login@userToken";
const Events = require("../models/Events");
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
      console.log("hell");
      const event = await Events.findById(EventID);
      const newuserreq= event.UserRequested.find(ele=>{
        ele.UserID===UserID
      })
      console.log(newuserreq);
      res.send("good")
    //   if (newuserreq.length===0) {
    //     event.UserRequested.push({
    //       UserID,
    //     });
    //     const savedEvent = await event.save();
    //     res.send(savedEvent);
    //   }
    //   else{
    //     res.send("User already exists");
    //   }
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = Router;

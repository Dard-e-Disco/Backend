const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    CreatorID:{type:Schema.Types.ObjectId, ref: "user", required:true},
    EventName: { type: String, required: true }, 
    desc: { type: String, required: true },
    np: { type: Number, required: true },
    npremaining: {
        type: Number, required: true
    },
    UserRequested:[{
        UserID:{type:Schema.Types.ObjectId, ref: "user"},
    }]

})
module.exports = mongoose.model('event', EventSchema)

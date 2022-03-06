const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({

    title: { type: String, required:true},
    description: { type: String, required:true},
    price: { type: Number, required:true},
    date: { type: Date, required:true},
    creator : 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'


        }
    

})

const Event = mongoose.model('event',eventSchema)

module.exports = Event
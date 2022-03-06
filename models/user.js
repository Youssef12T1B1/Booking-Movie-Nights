const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    username: { type: String, required:true},
    email: { type: String, required:true},
    password: { type: String, required:true},
    createdEvents : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'event'


        }
    ]


})

const User = mongoose.model('user',userSchema)

module.exports = User
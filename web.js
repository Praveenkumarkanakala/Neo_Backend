const mongoose = require('mongoose')

const webSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    email : { 
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    }
})

const web = mongoose.model('web',webSchema)

module.exports = web
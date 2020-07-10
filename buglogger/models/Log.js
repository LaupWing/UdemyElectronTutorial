const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
    text:{
        type: String,
        rquired: [true, 'Log text is required'],
        trim: true,
    },
    priority:{
        type: String,
        default: 'low',
        enum: ['low', 'moderate', 'high'],
    },
    user:{
        type: String,
        rquired: [true, 'User text is required'],
        trim: true,
    },
    created:{
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Log', LogSchema)
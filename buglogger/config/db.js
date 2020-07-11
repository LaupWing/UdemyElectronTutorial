const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://laupwing:heavy4oz@laupcluster.tyytf.mongodb.net/buglogger?retryWrites=true&w=majority',{
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to DB')
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB
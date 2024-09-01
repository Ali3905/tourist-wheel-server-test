const mongoose = require("mongoose")

const driverSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ["ALL", "CAR", "BUS", "TRUCK", "TAMPO"]
    },
    mobileNumber: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    
    state: {
        type: String
    },
    
    aadharCard: {
        type: String
    },
    license: {
        type: String
    },
    photo: {
        type: String
    }
}, { timestamps: true })

const driver = mongoose.model("driver", driverSchema)
module.exports = driver
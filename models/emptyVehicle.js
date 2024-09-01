const mongoose = require("mongoose")

const emptyVehicleSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: 'vehicle'
    },
    moreInformation: {
        type: String
    },
    departurePlace: {
        type: String
    },
    destinationPlace: {
        type: String
    },
    departureTime: {
        type: Date
    },
    departureDate: {
        type: Date
    },
    mobileNumber: {
        type: String
    },
    agency: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    photos: {
        type: [String],
    }
}, { timestamps: true })


const emptyVehicle = mongoose.model("emptyVehicle", emptyVehicleSchema)
module.exports = emptyVehicle
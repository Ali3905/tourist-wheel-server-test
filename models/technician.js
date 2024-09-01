const mongoose = require("mongoose")

const technicianSchema = mongoose.Schema({
    technicianType: {   //option  mechanical, electrician, psarepartshop, springwork, batterservices, vehiclebodyrepair
        type: String,
        enum: ["MECHANIC", "ELECTRICIAN", "SPAREPARTSHOP", "SPRINGWORK", "BATTERYSERVICES", "VEHICLEBODYREPAIR", "CRANESERVICES", "Hospital"],
    },
    name: {
        type: String,
        // required: true
    },
    state: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },
    mobileNumber: {
        type: String,
        // required: true
    },
    alternateNumber: {
        type: String,
        // required: true
    },
    vehicleType: {
        type: String,
        enum: ["ALL", "CAR", "BUS", "TRUCK", "TAMPO"],
        // required: true
    },
    ratings: {
        type: [{
            rating: Number,
            message: String,
            agency: { type: mongoose.Types.ObjectId, ref: "user" }
        }],
        default: []
    },
    avgRating: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const technician = mongoose.model("technician", technicianSchema)
module.exports = technician
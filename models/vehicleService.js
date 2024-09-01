const mongoose = require("mongoose")

const serviceSchema = mongoose.Schema({
    garageName: String,
    garageNumber: String,
    date: Date,
    workDescription: String,
    bill: [],
    vehicle: { type: mongoose.Types.ObjectId, ref: "vehicle" },
    
}, { timestamps: true })

const service = mongoose.model("service", serviceSchema)
module.exports = service
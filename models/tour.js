const mongoose = require("mongoose")

const tourSchema = mongoose.Schema({
    name: String,
    location: String,
    officeAddress: String,
    agencyName: String,
    primaryMobileNumber: String,
    secondaryMobileNumber: String,
    photos: [String],
}, { timestamps: true })

const tour = mongoose.model("tour", tourSchema)
module.exports = tour
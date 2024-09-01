const mongoose = require("mongoose")


const cleanerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    password: {
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
    photo: {
        type: String
    }




}, { timestamps: true })




const cleaner = mongoose.model("cleaner", cleanerSchema)
module.exports = cleaner


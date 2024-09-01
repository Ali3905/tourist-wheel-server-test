const mongoose = require("mongoose")

const vehicleDocumentsSchema = mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
   
    RC: {
        type: String,
        required: true,
        unique: true
    },
    Insurance: {
        type: String,
        required: true,
        unique: true
        
    },
    Permit: {
        type: String,
        required: true,
        unique: true
    },
    Fitness: {
        type: String,
        required: true,
        unique: true
    },
    Tax: {
        type: String,
        required: true,
        unique: true
    },
    Puc: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true })

const vehicleDocuments = mongoose.model("vehicleDocuments", vehicleDocumentsSchema)
module.exports =vehicleDocuments
const mongoose = require('mongoose');  ///vehicle health


const vehicleInspectionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref : "vehicle",
        required: true,
    },
    departurePlace: {
        type: String,
        required: true
    },
    destinationPlace: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
   beforeJourneyNote: {
        type: String,
        required: true
    },
   afterJourneyNote: {
        type: String,
        required: true
    },
    beforeJourneyPhotos: {
        type: Array,
        
    },
    afterJourneyPhotos: {
        type: Array,
    },

  
}, { timestamps: true });

const vehicleInspection = mongoose.model('vehicleInspection', vehicleInspectionSchema);

module.exports = vehicleInspection;



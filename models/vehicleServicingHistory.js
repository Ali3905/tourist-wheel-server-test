const mongoose = require('mongoose');


const vehicleServicingHistorySchema = new Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    garageName: {
        type: String,
        required: true
    },
    garageNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    
    workDescription: {
        type: String
    },
    bill: {
        type: String,
        required: true,
        unique: true
    }

}, {
    timestamps: true
});

const vehicleServicingHistory = mongoose.model('vehicleServicingHistory', vehicleServicingHistorySchema);

module.exports = vehicleServicingHistory;

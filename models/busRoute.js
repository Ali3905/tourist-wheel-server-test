const mongoose = require("mongoose")

const busRouteSchema = mongoose.Schema({
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: "vehicle"
    },
    primaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
        // required: true
    },
    secondaryDriver: {
        type: mongoose.Types.ObjectId,
        ref: "driver",
        // required: true
    },
    cleaner: {
        type: mongoose.Types.ObjectId,
        ref: "cleaner",
        // required: true
    },
    instructions: String,
    officeAddress: String,
    discount: Number,
    agencyName: String,
    departurePlace: String,
    destinationPlace: String,
    departureTime: Date,
    arrivalTime: Date,
    pickupPoint: String,
    dropoffPoint: String,
    ticketFare: Number,
    // busPhotos: [String],
    // isAC: Boolean,
    // isSleeper: Boolean,
    amenities: [String],
    doesCarryTwoWheelers: Boolean,
    doesProvideCourierService: Boolean,
    doesBookTrainTickets: Boolean,
    phonepeNumber: String,
    phonepeName: String,
    mobileNumbers: [],
    QR: String,
    seatingArrangement: String,
    beforeJourneyPhotos: [String],
    afterJourneyPhotos: [String],
    beforeJourneyNote: String,
    afterJourneyNote: String,
    status: {
        type: String,
        enum: ["CREATED", "FINALIZED", "STARTED", "COMPLETED"]
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })


const busRoute = mongoose.model("busRoute", busRouteSchema)
module.exports = busRoute
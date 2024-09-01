const emptyVehicle = require("../models/emptyVehicle")
const { agency, user } = require("../models/user")
const { vehicle } = require("../models/vehicle")

async function handleCreateEmptyVehicle(req, res) {
    try {
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }
        const { vehicleNo, moreInformation, departurePlace, destinationPlace, departureTime, departureDate, mobileNumber, photos } = req.body
        if (!vehicleNo || !moreInformation || !departurePlace || !destinationPlace || !departureTime || !departureDate || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        const foundVehicle = await vehicle.findOne({ number: vehicleNo })
        const foundAgency = await agency.findById(req.data._id)

        if (!foundAgency) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid creds"
            })
        }
        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        const createdEmptyVehicle = await emptyVehicle.create({ vehicle: foundVehicle, agency: foundAgency, moreInformation, departurePlace, destinationPlace, departureTime, departureDate, mobileNumber, photos })
        await user.findByIdAndUpdate(req.data._id, { $push: { emptyVehicles: createdEmptyVehicle } })
        return res.status(201).json({
            success: true,
            data: createdEmptyVehicle
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllEmptyVehicles(req, res) {
    try {
        const foundAgency = await user.findById(req.data._id).populate({
            path: "emptyVehicles",
            options: { sort: { createdAt: -1 } },
            populate: [
                { path: 'vehicle', select: 'number type' },
                { path: 'agency', select: 'companyName' }
            ]
        })

        if (!foundAgency || !foundAgency.emptyVehicles) {
            return res.status(400).json({
                success: false,
                message: "Could not find empty vehicles"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundAgency.emptyVehicles
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllAgenciesEmptyVehicles(req, res) {
    try {
        const foundEmptyVehicles = await emptyVehicle.find({}).populate([
            { path: 'vehicle', select: 'number type' },
            { path: 'agency', select: 'companyName' }
        ]).sort({ createdAt: -1 })

        if (!foundEmptyVehicles) {
            return res.status(400).json({
                success: false,
                message: "Could not find empty vehicles"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundEmptyVehicles
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteEmptyVehicle(req, res) {
    try {
        const { emptyVehicleId } = req.query
        if (!emptyVehicleId) {
            return res.status(400).json({
                success: false,
                message: "Please provide the empty vehicle ID"
            })
        }
        await emptyVehicle.findByIdAndDelete(emptyVehicleId)
        return res.status(200).json({
            success: true,
            message: "Empty vehicle deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateEmptyVehicle(req, res) {
    try {
        const { emptyVehicleId } = req.query
        if (!emptyVehicleId) {
            return res.status(400).json({
                success: false,
                message: "Please provide the empty vehicle ID"
            })
        }
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key] && req.files[key].length > 0) {
                    req.body[key] = [];
                    for (const file of req.files[key]) {
                        if (file.location) {
                            req.body[key].push(file.location);
                        }
                    }
                }
            }
        }
        const { vehicleNo, moreInformation, departurePlace, destinationPlace, departureTime, departureDate, mobileNumber, photos } = req.body
        if (!vehicleNo || !moreInformation || !departurePlace || !destinationPlace || !departureTime || !departureDate || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
        const foundVehicle = await vehicle.findOne({ number: vehicleNo })
        const foundAgency = await agency.findById(req.data._id)

        if (!foundAgency) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid creds"
            })
        }
        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        const updatedEmptyVehicle = await emptyVehicle.findByIdAndUpdate(emptyVehicleId, { vehicle: foundVehicle, agency: foundAgency, moreInformation, departurePlace, destinationPlace, departureTime, departureDate, mobileNumber, photos }, { new: true })
        return res.status(201).json({
            success: true,
            data: updatedEmptyVehicle
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateEmptyVehicle,
    handleGetAllEmptyVehicles,
    handleGetAllAgenciesEmptyVehicles,
    handleDeleteEmptyVehicle,
    handleUpdateEmptyVehicle
}

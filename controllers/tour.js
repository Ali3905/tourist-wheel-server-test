const tour = require("../models/tour")
const { user } = require("../models/user")

async function handleCreateTour(req, res) {
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
        const { name, officeAddress, location, primaryMobileNumber, secondaryMobileNumber, photos } = req.body
        const foundAgency = await user.findById(req.data._id)
        const createdTour = await tour.create({ name, officeAddress, location, primaryMobileNumber, secondaryMobileNumber, agencyName: foundAgency.companyName, photos })

        foundAgency.tours.push(createdTour)
        await foundAgency.save()

        return res.status(201).json({
            success: true,
            data: createdTour
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllTours(req, res) {
    try {
        const foundUser = await user.findById(req.data._id).populate({
            path: "tours",
            options: { sort: { createdAt: -1 } }
        })
        if (!foundUser.tours) {
            return res.status(400).json({
                success: false,
                message: "Could not find tours of this agency"
            })
        }
        res.status(200).json({
            success: true,
            data: foundUser.tours
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateTour(req, res) {
    try {
        const { tourId } = req.query
        if (!tourId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of tour to update it"
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
        const updatedTour = await tour.findByIdAndUpdate(tourId, req.body, { new: true })


        return res.status(200).json({
            success: true,
            data: updatedTour
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteTour(req, res) {
    try {
        const { tourId } = req.query
        if (!tourId) {
            return res.status(400).json({
                success: false,
                message: "Provide tour ID to Delete"
            })
        }

        await tour.findByIdAndDelete(tourId)
        return res.status(200).json({
            success: true,
            message: "Tour deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetTourByID(req, res) {
    try {
        const { tourId } = req.params
        if (!tourId) {
            return res.status(400).json({
                success: false,
                message: "Provide tour ID to Delete"
            })
        }

        const foundTour = await tour.findById(tourId)
        return res.status(200).json({
            success: true,
            data: foundTour
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateTour,
    handleGetAllTours,
    handleUpdateTour,
    handleDeleteTour,
    handleGetTourByID
}
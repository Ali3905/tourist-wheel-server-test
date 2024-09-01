const cleaner = require('../models/cleaner')
const { user } = require('../models/user')

async function handleGetAllCleaners(req, res) {

    try {

        if (req.data.role === "AGENCY" || "MANAGER" || "OFFICE-BOY") {
            const foundCleaners = await user.findById(req.data._id).populate({
                path: "cleaners",
                options: { sort: { createdAt: -1 } }
            })

            if (!foundCleaners) {
                return res.status(400).json({
                    success: false,
                    message: "Could find cleaners"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundCleaners.cleaners
            })
        }
        else {
            const foundCleaners = await cleaner.find({}).sort({createdAt: -1})
            if (!foundCleaners) {
                return res.status(400).json({
                    sucess: false,
                    message: "Could not find cleaners"
                })
            }
            return res.status(201).json({
                success: true,
                data: foundCleaners
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }


}

async function handleCreateCleaner(req, res) {
    try {

        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key][0] && req.files[key][0].location) {
                    req.body[key] = req.files[key][0].location; // Add the URL to req.body
                }
            }
        }

        const { name, password, city, state, mobileNumber, photo, aadharCard } = req.body

        if (!name || !password || !city || !state || !mobileNumber || !photo || !aadharCard) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "number should be less than 10 and greater than 11"

            })
        }

        const createdCleaner = await cleaner.create({
            name, password, city, state, mobileNumber, photo, aadharCard
        })
        const updatedUser = await user.findByIdAndUpdate(req.data._id, { $push: { cleaners: createdCleaner } }, { new: true })

        return res.status(201).json({
            success: true,
            createdCleaner
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteCleaner(req, res) {
    try {
        const { cleanerId } = req.query
        if (!cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide cleaner ID to delete it"
            })
        }

        const foundCleaner = await cleaner.findById(cleanerId)
        if (!foundCleaner) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid cleaner ID"
            })
        }

        await cleaner.findByIdAndDelete(cleanerId)
        await user.findByIdAndUpdate(req.data._id, { $pull: { cleaners: cleanerId } }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Cleaner Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

async function handleUpdateCleaner(req, res) {
    try {
        if (req.files) {
            for (const key of Object.keys(req.files)) {
                if (req.files[key][0] && req.files[key][0].location) {
                    req.body[key] = req.files[key][0].location;
                }
            }
        }

        const { cleanerId } = req.query
        // const { updatedDriver } = req.body
        console.log({ bo: req.body });
        if (!cleanerId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of clenaer to update"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated cleaner"
            })
        }
        await cleaner.findByIdAndUpdate(cleanerId, req.body)
        return res.status(200).json({
            success: true,
            message: "Cleaner updated",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreateCleaner,
    handleGetAllCleaners,
    handleDeleteCleaner,
    handleUpdateCleaner
}





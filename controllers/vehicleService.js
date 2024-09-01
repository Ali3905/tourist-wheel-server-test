const {user} = require("../models/user");
const { vehicle } = require("../models/vehicle")
const service = require("../models/vehicleService");

async function handleCreateService(req, res) {
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
        const { garageName, garageNumber, date, workDescription, bill, vehicleNumber } = req.body
        if (!vehicleNumber) {
            return res.status(400).json({
                success: false,
                message: "Provide vehicleNumber to add service"
            })
        }
        if (!garageName || !garageNumber || !date || !workDescription || !bill) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        const foundVehicle = await vehicle.findOne({ number: vehicleNumber })

        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid vehicle number that exists"
            })
        }
        const createdService = await service.create({ garageName, garageNumber, date, workDescription, bill, vehicle: foundVehicle })
        await user.findByIdAndUpdate(req.data._id, { $push: { services: createdService } }, { new: true })

        return res.status(201).json({
            success: true,
            data: createdService
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetAllServices(req, res) {
    try {
        if (req.data.role === "AGENCY" || "MANAGER" || "OFFICE-BOY") {
            const foundUser = await user.findById(req.data._id).populate({
                path: "services",
                options: { sort: { createdAt: -1 } }
            })

            if (!foundUser) {
                return res.status(400).json({
                    success: false,
                    message: "Could find user"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundUser.services
            })
        }
        else {
            const foundServices = await service.find({}).sort({createdAt: -1})
            if (!foundServices) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find services"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundServices
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleDeleteService(req, res) {
    try {
        const { serviceId } = req.query
        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Provide service ID to delete it"
            })
        }

        const foundService = await service.findById(serviceId)
        if (!foundService) {
            return res.status(400).json({
                success: false,
                message: "Service with this id do not exists. Provide a valid ID"
            })
        }

        await user.findByIdAndUpdate(req.data._id, { $pull: { services: serviceId } })
        await service.findByIdAndDelete(serviceId)

        return res.status(200).json({
            success: true,
            message: "Service Deleted"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdateService(req, res) {
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
        const { serviceId } = req.query
        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Provide service ID to delete it"
            })
        }
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Provide the updated service to update"
            })
        }
        const updatedService = await service.findByIdAndUpdate(serviceId, req.body, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedService
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    handleCreateService,
    handleGetAllServices,
    handleDeleteService,
    handleUpdateService
}

const cleaner = require("../models/cleaner")
const driver = require("../models/driver")
const employee = require("../models/employee")
const packageBooking = require("../models/packageVehicleBooking")
const {user} = require("../models/user")
const { vehicle } = require("../models/vehicle")
const { formatDate, formatTime } = require("../utils/others")
const { sendSms } = require("../utils/sms")

async function handleCreatePackageBooking(req, res) {
    try {
        const { vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note, pickupPoint } = req.body
        // console.log({ vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note });
        if (!vehicleId || !otherVehicleId || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRateInINR || !advanceAmountInINR || !remainingAmountInINR || !advancePlace || !departurePlace || !destinationPlace || !departureTime || !returnTime || !tollInINR || !otherStateTaxInINR || !departureDate || !returnDate || !pickupPoint) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile number"
            })
        }
        if (alternateNumber.length < 10 || alternateNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid alternate number"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId)
        const foundOtherVehicle = await vehicle.findById(otherVehicleId)
        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        if (!foundOtherVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid other vehicle ID"
            })
        }

        if (req.data.role === "MANAGER" || req.data.role === "OFFICE-BOY") {
            const foundEmployee = await employee.findById(req.data.employeeId)
            const createdPackageBooking = await packageBooking.create({ vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, status: "CREATED", createdBy: foundEmployee.name, note, isNotified: false, pickupPoint })
            await user.findByIdAndUpdate(req.data._id, { $push: { packageBookings: createdPackageBooking } }, { new: true })
            return res.status(201).json({
                success: true,
                data: createdPackageBooking
            })
        }
        const foundAgency = await user.findById(req.data._id)
        const bookingsCount = await packageBooking.countDocuments();
        const createdPackageBooking = await packageBooking.create({ vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, status: "CREATED", createdBy: foundAgency.userName, invoiceId : bookingsCount + 101, isNotified : false, note, pickupPoint })
        await user.findByIdAndUpdate(req.data._id, { $push: { packageBookings: createdPackageBooking } }, { new: true })

        const response = await sendSms(createdPackageBooking.mobileNumber, `Dear ${createdPackageBooking.customerName}, You have successfully booked a vehicle with ${foundAgency.companyName}. Your trip dates are from ${formatDate(createdPackageBooking.departureDate)} to ${formatDate(createdPackageBooking.returnDate)} For any information, please contact ${foundAgency.companyName}. Best regards, TOURIST JUNCTION PRIVATE LIMITED`, process.env.DLT_PACKAGE_BOOKING_SUCCESS_TEMPLATE_ID)
        return res.status(201).json({
            success: true,
            data: createdPackageBooking,
            smsResponse: response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleFinalizePackageBookings(req, res) {
    try {
        const { bookingId } = req.query
        const { primaryDriverId, secondaryDriverId, cleanerId, instructions, note } = req.body
        if (!primaryDriverId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to update"
            })
        }

        const primaryDriver = await driver.findById(primaryDriverId)
        const secondaryDriver = await driver.findById(secondaryDriverId)
        const foundCleaner = await cleaner.findById(cleanerId)

        if (!primaryDriver) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid primary driver ID"
            })
        }
        // if (!secondaryDriver) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Provide a valid secondary driver ID"
        //     })
        // }


        const updatedPackageBooking = await packageBooking.findByIdAndUpdate(bookingId, { primaryDriver, secondaryDriver, cleaner: foundCleaner, instructions, status: "FINALIZED", note }, { new: true }).populate("cleaner primaryDriver secondaryDriver vehicle")
        const customerResponse = await sendSms(updatedPackageBooking.mobileNumber, `Dear ${updatedPackageBooking.customerName}, For your upcoming journey, our drivers will be at your service. Please contact them at the following numbers: Name:${updatedPackageBooking.primaryDriver?.name}, Mobile:${updatedPackageBooking.primaryDriver?.mobileNumber} Name:${updatedPackageBooking.secondaryDriver?.name}, Mobile:${updatedPackageBooking.secondaryDriver?.mobileNumber} Name:${updatedPackageBooking.cleaner?.name}, Mobile:${updatedPackageBooking.cleaner?.mobileNumber} Thank you for choosing Tusharraj Travel. Best regards, TOURIST JUNCTION PRIVATE LIMITED`, process.env.DLT_PACKAGE_BOOKING_FINALIZATION_TEMPLATE_ID)
        // Make the agency name dynamic
        
        const primaryDriverResponse = await sendSms(updatedPackageBooking.primaryDriver?.mobileNumber, `You have been selected for a trip with ${"Tusharraj Travels"}. Departure Date: ${formatDate(updatedPackageBooking.departureDate)} Vehicle Number:${updatedPackageBooking.vehicle.number} Customer Name:${updatedPackageBooking.customerName} Customer Contact:${updatedPackageBooking.mobileNumber} Pick-Up Point:${updatedPackageBooking.kmStarting} Route: ${updatedPackageBooking.departurePlace} to ${updatedPackageBooking.destinationPlace} Pick-Up Time:${formatTime(updatedPackageBooking.departureTime)} Please reach the bus parking area 2 hours before departure and check the vehicle. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedPackageBooking.primaryDriver?.name}, Mobile:${updatedPackageBooking.primaryDriver?.mobileNumber} Name:${updatedPackageBooking.secondaryDriver?.name}, Mobile:${updatedPackageBooking.secondaryDriver?.mobileNumber} Name:${updatedPackageBooking.cleaner?.name} Mobile:${updatedPackageBooking.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`, process.env.DLT_PACKAGE_BOOKING_FINALIZATION_DRIVER_TEMPLATE_ID)

        const secondaryDriverResponse = await sendSms(updatedPackageBooking.secondaryDriver?.mobileNumber, `You have been selected for a trip with ${"Tusharraj Travels"}. Departure Date: ${formatDate(updatedPackageBooking.departureDate)} Vehicle Number:${updatedPackageBooking.vehicle.number} Customer Name:${updatedPackageBooking.customerName} Customer Contact:${updatedPackageBooking.mobileNumber} Pick-Up Point:${updatedPackageBooking.kmStarting} Route: ${updatedPackageBooking.departurePlace} to ${updatedPackageBooking.destinationPlace} Pick-Up Time:${formatTime(updatedPackageBooking.departureTime)} Please reach the bus parking area 2 hours before departure and check the vehicle. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedPackageBooking.primaryDriver?.name}, Mobile:${updatedPackageBooking.primaryDriver?.mobileNumber} Name:${updatedPackageBooking.secondaryDriver?.name}, Mobile:${updatedPackageBooking.secondaryDriver?.mobileNumber} Name:${updatedPackageBooking.cleaner?.name} Mobile:${updatedPackageBooking.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`, process.env.DLT_PACKAGE_BOOKING_FINALIZATION_DRIVER_TEMPLATE_ID)
        
        const cleanerResponse = await sendSms(updatedPackageBooking.cleaner?.mobileNumber, `You have been selected for a trip with ${"Tusharraj Travels"}. Departure Date: ${formatDate(updatedPackageBooking.departureDate)} Vehicle Number:${updatedPackageBooking.vehicle.number} Customer Name:${updatedPackageBooking.customerName} Customer Contact:${updatedPackageBooking.mobileNumber} Pick-Up Point:${updatedPackageBooking.kmStarting} Route: ${updatedPackageBooking.departurePlace} to ${updatedPackageBooking.destinationPlace} Pick-Up Time:${formatTime(updatedPackageBooking.departureTime)} Please reach the bus parking area 2 hours before departure and check the vehicle. Kindly start the trip from your app before departure. All driver and cleaner details for this trip: Name:${updatedPackageBooking.primaryDriver?.name}, Mobile:${updatedPackageBooking.primaryDriver?.mobileNumber} Name:${updatedPackageBooking.secondaryDriver?.name}, Mobile:${updatedPackageBooking.secondaryDriver?.mobileNumber} Name:${updatedPackageBooking.cleaner?.name} Mobile:${updatedPackageBooking.cleaner?.mobileNumber} Best regards, TOURIST JUNCTION PRIVATE LIMITED`, process.env.DLT_PACKAGE_BOOKING_FINALIZATION_DRIVER_TEMPLATE_ID)

        return res.status(200).json({
            success: true,
            data: updatedPackageBooking,
            customerSmsResponse: customerResponse,
            driverSmsResponse: primaryDriverResponse
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleUpdatePackageBooking(req, res) {
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

        const { bookingId } = req.query
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to update"
            })
        }
        const { vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note } = req.body
        // console.log({ vehicleId, otherVehicleId, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR, note });
        if (!vehicleId || !otherVehicleId || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRateInINR || !advanceAmountInINR || !remainingAmountInINR || !advancePlace || !departurePlace || !destinationPlace || !departureTime || !returnTime || !tollInINR || !otherStateTaxInINR || !note) {
            return res.status(400).json({
                success: false,
                message: "Provide all the fields"
            })
        }
        if (mobileNumber.length < 10 || mobileNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid mobile number"
            })
        }
        if (alternateNumber.length < 10 || alternateNumber.length > 12) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid alternate number"
            })
        }
        const foundVehicle = await vehicle.findById(vehicleId)
        const foundOtherVehicle = await vehicle.findById(otherVehicleId)
        if (!foundVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid vehicle ID"
            })
        }
        if (!foundOtherVehicle) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid other vehicle ID"
            })
        }
        const updatedPackageBooking = await packageBooking.findByIdAndUpdate(bookingId, { vehicle: foundVehicle, otherVehicle: foundOtherVehicle, customerName, mobileNumber, alternateNumber, kmStarting, perKmRateInINR, advanceAmountInINR, remainingAmountInINR, advancePlace, departurePlace, destinationPlace, departureTime, departureDate, returnTime, returnDate, tollInINR, otherStateTaxInINR }, { new: true })

        return res.status(200).json({
            success: true,
            data: updatedPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function handleGetAllPackageBookings(req, res) {
    try {

        if (req.data.role === "AGENCY" || "MANAGER" || "OFFICE-BOY") {
            const foundUser = await user.findById(req.data._id).populate({
                path: "packageBookings",
                options: { sort: { createdAt: -1 } }, // Sort dailyRoutes by createdAt in descending order
                populate: [
                    { path: "cleaner", model: "cleaner" },
                    { path: "vehicle", model: "vehicle" },
                    { path: "otherVehicle", model: "vehicle" },
                    { path: "primaryDriver", model: "driver" },
                    { path: "secondaryDriver", model: "driver" }
                ]
            });
            if (!foundUser) {
                return res.status(400).json({
                    success: false,
                    message: "Could not find the package bookings"
                })
            }
            return res.status(200).json({
                success: true,
                data: foundUser.packageBookings
            })
        }

        const foundBookings = await packageBooking.find({}).populate("primaryDriver secondaryDriver cleaner vehicle otherVehicle").sort({createdAt: -1})
        if (!foundBookings) {
            return res.status(400).json({
                success: false,
                message: "Could not find the package bookings"
            })
        }
        return res.status(200).json({
            success: true,
            data: foundBookings
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
async function handleGetPackageBookingByID(req, res) {
    try {
        const { bookingId } = req.params
        const foundPackageBooking = await packageBooking.findById(bookingId).populate("vehicle otherVehicle")

        if (!foundPackageBooking) {
            return res.status(400).json({
                success: false,
                message: "Could find package bookings"
            })
        }

        return res.status(200).json({
            success: true,
            data: foundPackageBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


async function handleDeletePackageBooking(req, res) {
    try {
        const { bookingId } = req.query
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Provide the ID of booking to delete"
            })
        }
        console.log(bookingId);
        const foundPackageBooking = await packageBooking.findById(bookingId)
        if (!foundPackageBooking) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid booking ID"
            })
        }
        await user.findByIdAndUpdate(req.data._id, { $pull: { packageBookings: bookingId } }, { new: true })
        await packageBooking.findByIdAndDelete(bookingId)
        return res.status(200).json({
            success: true,
            message: "Package Booking Deleted"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleStartPackageBooking(req, res) {
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
        const { beforeJourneyPhotos, beforeJourneyNote } = req.body
        const { bookingId } = req.query
        if (!beforeJourneyPhotos || !beforeJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }

        const foundBooking = await packageBooking.findById(bookingId)
        if (foundBooking.status !== "FINALIZED") {
            return res.status(400).json({
                success: false,
                message: "The selected booking is not in a state to start. It is either completed, started or not finalized yet"
            })
        }

        const updatedBooking = await packageBooking.findByIdAndUpdate(bookingId, { beforeJourneyPhotos, beforeJourneyNote, status: "STARTED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleCompletePackageBooking(req, res) {
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
        const { afterJourneyPhotos, afterJourneyNote } = req.body
        const { bookingId } = req.query
        if (!afterJourneyPhotos || !afterJourneyNote) {
            return res.status(400).json({
                success: false,
                message: "Provide All the fields"
            })
        }
        const foundBooking = await packageBooking.findById(bookingId)
        if (foundBooking.status !== "STARTED") {
            return res.status(400).json({
                success: false,
                message: "The selected booking is not in a state to end. It is either completed, created or not finalized yet"
            })
        }

        const updatedBooking = await packageBooking.findByIdAndUpdate(bookingId, { afterJourneyPhotos, afterJourneyNote, status: "COMPLETED" }, { new: true })
        return res.status(200).json({
            success: true,
            data: updatedBooking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function handleGetDriverPackageBookings(req, res) {
    try {
        const { driverId } = req.params

        if (!driverId) {
            return res.status(400).json({
                success: false,
                message: "Provide the driver ID"
            })
        }

        const foundBookings = await packageBooking.find({
            $or: [
                { primaryDriver: driverId },
                { secondaryDriver: driverId }
            ]
        }).populate("cleaner vehicle otherVehicle primaryDriver secondaryDriver").sort({ createdAt: -1 })
        

        return res.status(200).json({
            success: true,
            data: foundBookings
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {
    handleCreatePackageBooking,
    handleFinalizePackageBookings,
    handleUpdatePackageBooking,
    handleGetAllPackageBookings,
    handleDeletePackageBooking,
    handleGetPackageBookingByID,
    handleStartPackageBooking,
    handleCompletePackageBooking,
    handleGetDriverPackageBookings
}

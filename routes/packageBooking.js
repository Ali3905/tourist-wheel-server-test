const express = require("express")
const { handleCreatePackageBooking, handleGetAllPackageBookings, handleDeletePackageBooking, handleGetPackageBookingByID, handleFinalizePackageBookings, handleUpdatePackageBooking, handleStartPackageBooking, handleCompletePackageBooking, handleGetDriverPackageBookings } = require("../controllers/packageBooking")
const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("../middlewares/auth")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), handleCreatePackageBooking)
router.patch("/finalize", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), handleFinalizePackageBookings)
router.patch("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), handleUpdatePackageBooking)
router.get("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), handleGetAllPackageBookings)
router.get("/:bookingId", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), handleGetPackageBookingByID)
router.get("/driver/:driverId", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), handleGetDriverPackageBookings)
router.delete("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER", "MANAGER", "OFFICE-BOY"]), handleDeletePackageBooking)
router.patch("/start", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), upload.fields([{ name: "beforeJourneyPhotos", maxCount: 5 }]), handleStartPackageBooking)
router.patch("/complete", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), upload.fields([{ name: "afterJourneyPhotos", maxCount: 5 }]), handleCompletePackageBooking)


module.exports = router
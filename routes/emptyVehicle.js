const express = require("express")
const { handleAuthorizeUserByRole, handleGetUserByAuthToken } = require("../middlewares/auth")
const { handleCreateEmptyVehicle, handleGetAllEmptyVehicles, handleDeleteEmptyVehicle, handleUpdateEmptyVehicle, handleGetAllAgenciesEmptyVehicles } = require("../controllers/emptyVehicle")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), upload.fields([{ name: "photos", maxCount: 2 }]), handleCreateEmptyVehicle)
router.get("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), handleGetAllEmptyVehicles)
router.get("/all", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), handleGetAllAgenciesEmptyVehicles)
router.delete("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), handleDeleteEmptyVehicle)
router.patch("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "MANAGER", "OFFICE-BOY"]), upload.fields([{ name: "photos", maxCount: 2 }]), handleUpdateEmptyVehicle)

module.exports = router
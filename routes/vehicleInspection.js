const express = require("express")
const { handleCreateVehicleInspection, handleGetAllVehicleInspections, handleDeleteVehicleInspection, handleUpdateVehicleInspection } = require("../controllers/vehicleInspection")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleCreateVehicleInspection)
router.get("/", handleGetAllVehicleInspections)
router.delete("/", handleDeleteVehicleInspection)
router.patch("/", upload.fields([{name : "beforeJourneyPhotos", maxCount : 5}, {name : "afterJourneyPhotos", maxCount : 5}]), handleUpdateVehicleInspection)

module.exports = router



const express = require("express")
const { handleCreateVehicle, handleGetAllVehicles, handleDeleteVehicle, handleUpdateVehicle, handleUpdateTruck, handleGetAllVehiclesByVehicleType, handleGetRentVehicles, handleGetSellVehicles, handleAddDocuments, handleGetVehicleById, handleDeleteDocuments, handleGetAllVehiclesImages } = require("../controllers/vehicle")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateVehicle)
router.get("/:vehicleType", handleGetAllVehiclesByVehicleType)
router.get("/purpose/RENT", handleGetRentVehicles)
router.get("/purpose/SELL", handleGetSellVehicles)
router.get("/", handleGetAllVehicles)
router.get("/all/photos", handleGetAllVehiclesImages)
router.get("/id/:vehicleId", handleGetVehicleById)
router.delete("/", handleDeleteVehicle),
router.patch("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateVehicle)
router.patch("/addDocuments", upload.fields([{ name: "RC", maxCount: 1 }, { name: "permit", maxCount: 1 }, { name: "fitness", maxCount: 1 }, { name: "tax", maxCount: 1 }, { name: "insurance", maxCount: 1 } ,{ name: "PUC", maxCount: 1 }]), handleAddDocuments)
router.delete("/deleteDocuments", handleDeleteDocuments)
router.patch("/truck", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateTruck)

module.exports = router
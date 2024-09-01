const express = require("express")
const { handleCreateTour, handleGetAllTours, handleUpdateTour, handleDeleteTour, handleGetTourByID } = require("../controllers/tour")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleCreateTour)
router.get("/", handleGetAllTours)
router.get("/:tourId", handleGetTourByID)
router.patch("/", upload.fields([{ name: "photos", maxCount: 5 }]), handleUpdateTour)
router.delete("/", handleDeleteTour)

module.exports = router
const express = require("express")
const { handleGetAllDailyRoutes, handleCreateDailyRoute, handleDeleteDailyRoute, handleUpdateDailyRoute, handleFinalizeDailyRoute, handleStartDailyRoute, handleCompleteDailyRoute, handleGetDriverDailyRoutes } = require("../controllers/dailyRoute")
const { upload } = require("../middlewares/upload")
const { handleGetUserByAuthToken, handleAuthorizeUserByRole } = require("../middlewares/auth")
const router = express.Router()

router.post("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleCreateDailyRoute)
router.patch("/finalize", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleFinalizeDailyRoute)
router.get("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN"]), handleGetAllDailyRoutes)
router.get("/driver/:driverId", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), handleGetDriverDailyRoutes)
router.delete("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY"]), handleDeleteDailyRoute)
router.patch("/", handleGetUserByAuthToken, handleAuthorizeUserByRole(["AGENCY", "ADMIN", "DRIVER"]), handleUpdateDailyRoute)
router.patch("/start", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), upload.fields([{ name: "beforeJourneyPhotos", maxCount: 5 }]), handleStartDailyRoute)
router.patch("/complete", handleGetUserByAuthToken, handleAuthorizeUserByRole(["DRIVER"]), upload.fields([, { name: "afterJourneyPhotos", maxCount: 5 }]), handleCompleteDailyRoute)

module.exports = router
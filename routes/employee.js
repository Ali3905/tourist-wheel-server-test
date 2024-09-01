const express = require("express")
const { handleCreateEmployee, handleGetAllEmployees, handleDeleteEmployee, handleUpdateEmployee } = require("../controllers/employee")
const { upload } = require("../middlewares/upload")
const router = express.Router()

router.post("/", upload.fields([ {name : "photo", maxCount : 1}, {name : "aadharCard", maxCount : 1}]), handleCreateEmployee)
router.get("/", handleGetAllEmployees)
router.delete("/", handleDeleteEmployee)
router.patch("/", upload.fields([ {name : "photo", maxCount : 1}, {name : "aadharCard", maxCount : 1}]), handleUpdateEmployee)

module.exports = router


